import uuid
import base64
import hashlib
import json
import logging
from datetime import timedelta, datetime
from django.utils import timezone
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db import transaction
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
import requests

from .models import CustomerReceipt, InsurerPayment, Premium, PremiumPaymentLog, PaymentLink
from companies.models import Company
from .serializers import (
    CustomerReceiptSerializer,
    InsurerPaymentSerializer,
    PremiumSerializer,
    PremiumPaymentLogSerializer,
    PaymentLinkSerializer,
)

logger = logging.getLogger(__name__)

# M-Pesa Daraja API configuration (static defaults)
MPESA_TILL_NUMBER = "143457"
MPESA_PASSKEY = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"  # Sandbox default

# Lazy accessors — read from settings on every call, so env var changes take effect
# without a server restart (or survive a first-import race condition).
def get_mpesa_consumer_key():
    return getattr(settings, 'MPESA_CONSUMER_KEY', '')

def get_mpesa_consumer_secret():
    return getattr(settings, 'MPESA_CONSUMER_SECRET', '')

def get_mpesa_environment():
    return getattr(settings, 'MPESA_ENVIRONMENT', 'sandbox')

def get_mpesa_shortcode():
    return getattr(settings, 'MPESA_SHORTCODE', '174379')

def get_mpesa_base_url():
    if get_mpesa_environment() == 'production':
        return 'https://api.safaricom.co.ke'
    return 'https://sandbox.safaricom.co.ke'

def get_mpesa_access_token():
    """Get OAuth access token from Safaricom API"""
    consumer_key = get_mpesa_consumer_key()
    consumer_secret = get_mpesa_consumer_secret()

    if not consumer_key or not consumer_secret:
        logger.error("M-Pesa credentials not configured: MPESA_CONSUMER_KEY and/or MPESA_CONSUMER_SECRET are empty")
        return None

    try:
        api_url = f"{get_mpesa_base_url()}/oauth/v1/generate?grant_type=client_credentials"
        response = requests.get(
            api_url,
            auth=(consumer_key, consumer_secret),
            headers={'Accept': 'application/json'},
            timeout=30
        )
        logger.info(f"M-Pesa auth response status: {response.status_code}")
        data = response.json()
        if 'access_token' in data:
            return data['access_token']
        else:
            logger.error(f"M-Pesa auth response missing access_token: {data}")
            return None
    except Exception as e:
        logger.error(f"Failed to get M-Pesa access token: {e}")
        return None

def generate_password(shortcode, passkey, timestamp):
    """Generate base64 encoded password for STK push"""
    data = f"{shortcode}{passkey}{timestamp}"
    return base64.b64encode(data.encode()).decode()

def initiate_stk_push(phone_number, amount, transaction_desc, account_ref):
    """
    Initiate M-Pesa STK Push (Lipa Na M-Pesa Online Payment API)
    Sends payment prompt to customer's phone
    """
    try:
        access_token = get_mpesa_access_token()
        if not access_token:
            return None, "Failed to authenticate with M-Pesa"

        shortcode = get_mpesa_shortcode()
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        password = generate_password(shortcode, MPESA_PASSKEY, timestamp)

        # Format phone: 254XXXXXXXXX
        formatted_phone = phone_number.strip()
        if formatted_phone.startswith('0'):
            formatted_phone = '254' + formatted_phone[1:]
        elif formatted_phone.startswith('+'):
            formatted_phone = formatted_phone[1:]
        elif not formatted_phone.startswith('254'):
            formatted_phone = '254' + formatted_phone

        payload = {
            "BusinessShortCode": shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerBuyGoodsOnline",
            "Amount": int(round(amount)),
            "PartyA": formatted_phone,
            "PartyB": MPESA_TILL_NUMBER,
            "PhoneNumber": formatted_phone,
            "CallBackURL": f"{getattr(settings, 'SITE_URL', 'https://starzed.onrender.com')}/api/payments/mpesa-callback/",
            "AccountReference": account_ref[:12],
            "TransactionDesc": transaction_desc[:13] if transaction_desc else "Insurance Payment"
        }

        api_url = f"{get_mpesa_base_url()}/mpesa/stkpush/v1/processrequest"
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }

        response = requests.post(api_url, json=payload, headers=headers, timeout=30)
        result = response.json()

        if result.get('ResponseCode') == '0':
            return result.get('CheckoutRequestID'), None
        else:
            error_msg = result.get('ResponseDescription', 'STK push failed')
            logger.error(f"M-Pesa STK push error: {result}")
            return None, error_msg

    except Exception as e:
        logger.error(f"M-Pesa STK push exception: {e}")
        return None, str(e)

def query_stk_status(checkout_request_id):
    """Query the status of an STK push transaction"""
    try:
        access_token = get_mpesa_access_token()
        if not access_token:
            return None, "Failed to authenticate with M-Pesa"

        shortcode = get_mpesa_shortcode()
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        password = generate_password(shortcode, MPESA_PASSKEY, timestamp)

        payload = {
            "BusinessShortCode": shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "CheckoutRequestID": checkout_request_id
        }

        api_url = f"{get_mpesa_base_url()}/mpesa/stkpushquery/v1/query"
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }

        response = requests.post(api_url, json=payload, headers=headers, timeout=30)
        return response.json(), None

    except Exception as e:
        logger.error(f"M-Pesa STK query exception: {e}")
        return None, str(e)


@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def receipt_list(request):
    if request.method == 'GET':
        queryset = CustomerReceipt.objects.all().order_by('-created_at')
        serializer = CustomerReceiptSerializer(queryset, many=True)
        return Response({'success': True, 'data': serializer.data})

    serializer = CustomerReceiptSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {'success': True, 'message': 'Receipt created successfully', 'data': serializer.data},
            status=status.HTTP_201_CREATED,
        )
    return Response(
        {'success': False, 'message': 'Validation errors', 'errors': serializer.errors},
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([permissions.AllowAny])
def receipt_detail(request, id):
    try:
        obj = CustomerReceipt.objects.get(id=id)
    except CustomerReceipt.DoesNotExist:
        return Response({'success': False, 'message': 'Receipt not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CustomerReceiptSerializer(obj)
        return Response({'success': True, 'data': serializer.data})

    if request.method in ['PUT', 'PATCH']:
        serializer = CustomerReceiptSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'message': 'Receipt updated successfully', 'data': serializer.data})
        return Response(
            {'success': False, 'message': 'Validation errors', 'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    obj.delete()
    return Response({'success': True, 'message': 'Receipt deleted successfully'})


@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def insurer_payment_list(request):
    if request.method == 'GET':
        queryset = InsurerPayment.objects.all().order_by('-created_at')
        serializer = InsurerPaymentSerializer(queryset, many=True)
        return Response({'success': True, 'data': serializer.data})

    serializer = InsurerPaymentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {'success': True, 'message': 'Insurer payment created successfully', 'data': serializer.data},
            status=status.HTTP_201_CREATED,
        )
    return Response(
        {'success': False, 'message': 'Validation errors', 'errors': serializer.errors},
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([permissions.AllowAny])
def insurer_payment_detail(request, id):
    try:
        obj = InsurerPayment.objects.get(id=id)
    except InsurerPayment.DoesNotExist:
        return Response({'success': False, 'message': 'Insurer payment not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = InsurerPaymentSerializer(obj)
        return Response({'success': True, 'data': serializer.data})

    if request.method in ['PUT', 'PATCH']:
        serializer = InsurerPaymentSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'message': 'Insurer payment updated successfully', 'data': serializer.data})
        return Response(
            {'success': False, 'message': 'Validation errors', 'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    obj.delete()
    return Response({'success': True, 'message': 'Insurer payment deleted successfully'})


@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def premium_list(request):
    if request.method == 'GET':
        queryset = Premium.objects.all().order_by('-created_at')
        serializer = PremiumSerializer(queryset, many=True)
        return Response({'success': True, 'data': serializer.data})

    serializer = PremiumSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {'success': True, 'message': 'Premium created successfully', 'data': serializer.data},
            status=status.HTTP_201_CREATED,
        )
    return Response(
        {'success': False, 'message': 'Validation errors', 'errors': serializer.errors},
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([permissions.AllowAny])
def premium_detail(request, id):
    try:
        obj = Premium.objects.get(id=id)
    except Premium.DoesNotExist:
        return Response({'success': False, 'message': 'Premium not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = PremiumSerializer(obj)
        return Response({'success': True, 'data': serializer.data})

    if request.method in ['PUT', 'PATCH']:
        serializer = PremiumSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'message': 'Premium updated successfully', 'data': serializer.data})
        return Response(
            {'success': False, 'message': 'Validation errors', 'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    obj.delete()
    return Response({'success': True, 'message': 'Premium deleted successfully'})


@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def premium_payment_log_list(request):
    if request.method == 'GET':
        queryset = PremiumPaymentLog.objects.all().order_by('-created_at')
        serializer = PremiumPaymentLogSerializer(queryset, many=True)
        return Response({'success': True, 'data': serializer.data})

    serializer = PremiumPaymentLogSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {'success': True, 'message': 'Premium payment log created successfully', 'data': serializer.data},
            status=status.HTTP_201_CREATED,
        )
    return Response(
        {'success': False, 'message': 'Validation errors', 'errors': serializer.errors},
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([permissions.AllowAny])
def premium_payment_log_detail(request, id):
    try:
        obj = PremiumPaymentLog.objects.get(id=id)
    except PremiumPaymentLog.DoesNotExist:
        return Response({'success': False, 'message': 'Premium payment log not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = PremiumPaymentLogSerializer(obj)
        return Response({'success': True, 'data': serializer.data})

    if request.method in ['PUT', 'PATCH']:
        serializer = PremiumPaymentLogSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'message': 'Premium payment log updated successfully', 'data': serializer.data})
        return Response(
            {'success': False, 'message': 'Validation errors', 'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    obj.delete()
    return Response({'success': True, 'message': 'Premium payment log deleted successfully'})


@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def payment_link_list(request):
    if request.method == 'GET':
        queryset = PaymentLink.objects.all().order_by('-created_at')
        serializer = PaymentLinkSerializer(queryset, many=True)
        return Response({'success': True, 'data': serializer.data})

    serializer = PaymentLinkSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {'success': True, 'message': 'Payment link created successfully', 'data': serializer.data},
            status=status.HTTP_201_CREATED,
        )
    return Response(
        {'success': False, 'message': 'Validation errors', 'errors': serializer.errors},
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([permissions.AllowAny])
def payment_link_detail(request, id):
    try:
        obj = PaymentLink.objects.get(id=id)
    except PaymentLink.DoesNotExist:
        return Response({'success': False, 'message': 'Payment link not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = PaymentLinkSerializer(obj)
        return Response({'success': True, 'data': serializer.data})

    if request.method in ['PUT', 'PATCH']:
        serializer = PaymentLinkSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'message': 'Payment link updated successfully', 'data': serializer.data})
        return Response(
            {'success': False, 'message': 'Validation errors', 'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    obj.delete()
    return Response({'success': True, 'message': 'Payment link deleted successfully'})


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def bulk_import_receipts(request):
    data_list = request.data.get('receipts', [])
    created = []
    updated = []
    failed = []

    with transaction.atomic():
        for row in data_list:
            receipt_no = (row.get('receipt_no') or row.get('receiptNo') or '').strip()
            client_name = (row.get('client_name') or row.get('clientName') or '').strip()
            if not receipt_no:
                failed.append({'data': row, 'error': 'Receipt number is required'})
                continue
            if not client_name:
                failed.append({'data': row, 'error': 'Client name is required'})
                continue

            defaults = {
                'client_name': client_name,
                'policy_number': row.get('policy_number') or row.get('policyNo') or None,
                'amount': row.get('amount') or 0,
                'payment_method': row.get('payment_method') or row.get('paymentMethod') or None,
                'status': 'Completed',
            }
            try:
                obj, was_created = CustomerReceipt.objects.update_or_create(receipt_no=receipt_no, defaults=defaults)
                if was_created:
                    created.append({'id': str(obj.id), 'receipt_no': obj.receipt_no})
                else:
                    updated.append({'id': str(obj.id), 'receipt_no': obj.receipt_no})
            except Exception as e:
                failed.append({'data': row, 'error': str(e)})

    return Response({
        'success': True,
        'message': f'Import completed. Created: {len(created)}, Updated: {len(updated)}, Failed: {len(failed)}',
        'created': created,
        'updated': updated,
        'failed': failed,
    })


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def generate_payment_link(request):
    """
    Generate a secure payment link for a client
    """
    try:
        data = request.data
        client = data.get('client', {})
        policy = data.get('policy', {})
        company = data.get('company', {})
        product = data.get('product', {})
        customer_details = data.get('customerDetails', {})
        policy_details = data.get('policyDetails', {})
        expiry_hours = data.get('expiryHours', 24)

        # Create a token/link
        token = uuid.uuid4().hex[:16]
        from django.conf import settings as django_settings

        # Check if running in development mode
        origin = request.META.get('HTTP_ORIGIN', '')
        is_dev = 'localhost' in origin or '127.0.0.1' in origin
        if is_dev:
            base_url = origin.rstrip('/')
        else:
            # Production: use configured SITE_URL or origin if available
            base_url = origin.rstrip('/') if origin else django_settings.SITE_URL.rstrip('/')
        payment_link = f"{base_url}/pay/{token}"

        # Parse amount: try numeric policy premium_amount first, then product premium display string
        raw_amount = (policy.get('premium_amount')
                      or policy.get('premium')
                      or product.get('premium')
                      or 0)

        def extract_numeric(val):
            """Extract first number from a string like 'From KES 5,000/month' -> 5000.0"""
            import re
            if isinstance(val, (int, float)):
                return float(val)
            cleaned = str(val).replace(',', '')
            matches = re.findall(r'\d+\.?\d*', cleaned)
            return float(matches[0]) if matches else 0

        try:
            amount_value = extract_numeric(raw_amount)
        except (ValueError, TypeError):
            amount_value = 0

        # Store in database with rich metadata
        PaymentLink.objects.create(
            client_name=client.get('client_name', client.get('name', 'Unknown')),
            policy_number=policy.get('policy_number', ''),
            amount=amount_value,
            link_url=payment_link,
            status='Active',
            expires_at=timezone.now() + timedelta(hours=int(expiry_hours)),
            meta={
                'token': token,
                'client': client,
                'policy': policy,
                'company': company,
                'product': product,
                'customerDetails': customer_details,
                'policyDetails': policy_details,
            }
        )

        return Response({
            'success': True,
            'paymentLink': payment_link,
            'message': 'Payment link generated successfully'
        })

    except Exception as e:
        return Response({
            'success': False,
            'message': f'Failed to generate payment link: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def send_link_email(request):
    """
    Send payment link via email (placeholder - logs instead of actually sending)
    """
    try:
        data = request.data
        to_email = data.get('to', '')
        customer_name = data.get('customerName', '')
        product_name = data.get('productName', '')
        payment_link = data.get('paymentLink', '')

        # Log the email that would be sent
        print(f"=== Payment Link Email ===")
        print(f"To: {to_email}")
        print(f"Customer: {customer_name}")
        print(f"Product: {product_name}")
        print(f"Link: {payment_link}")
        print(f"Expires: {data.get('expiryHours', 24)} hours")

        return Response({
            'success': True,
            'message': f'Payment link sent to {to_email}'
        })

    except Exception as e:
        return Response({
            'success': False,
            'message': f'Failed to send email: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def lookup_payment_link(request, token):
    """
    Look up a payment link by its token (extracted from /pay/<token> URL)
    """
    try:
        payment_link = PaymentLink.objects.filter(
            link_url__contains=f'/pay/{token}'
        ).first()

        if not payment_link:
            return Response({
                'success': False,
                'message': 'Invalid payment link',
                'valid': False,
            }, status=status.HTTP_404_NOT_FOUND)

        # Check if expired
        if payment_link.expires_at and payment_link.expires_at < timezone.now():
            payment_link.status = 'Expired'
            payment_link.save(update_fields=['status'])
            return Response({
                'success': True,
                'valid': False,
                'message': 'This payment link has expired',
                'expired': True,
            })

        if payment_link.status != 'Active':
            return Response({
                'success': True,
                'valid': False,
                'message': f'This payment link is {payment_link.status.lower()}',
            })

        meta = payment_link.meta or {}
        product = meta.get('product', {})
        customer_details = meta.get('customerDetails', {})
        policy_details = meta.get('policyDetails', {})
        policy = meta.get('policy', {})
        company = meta.get('company', {})

        raw_amount = str(payment_link.amount) if payment_link.amount else '0'
        try:
            amount_val = float(raw_amount.replace(',', ''))
        except ValueError:
            amount_val = 0

        # Fallback: if stored amount is 0, try getting it from meta data
        if amount_val == 0:
            meta_amount = (
                meta.get('policy', {}).get('premium_amount')
                or meta.get('policy', {}).get('premium')
                or meta.get('product', {}).get('premium')
                or meta.get('client', {}).get('premium')
            )
            if meta_amount:
                try:
                    import re
                    cleaned = str(meta_amount).replace(',', '')
                    matches = re.findall(r'\d+\.?\d*', cleaned)
                    if matches:
                        amount_val = float(matches[0])
                except (ValueError, TypeError):
                    pass

        company_info = {
            'display_name': company.get('display_name', company.get('name', 'Starzed Insurance')),
            'logo': company.get('logo', ''),
            'contact': company.get('contact', {}),
            'website': company.get('website', ''),
            'headquarters': company.get('headquarters', ''),
        } if company else {}

        product_type = (product.get('category', '') or '').lower()

        return Response({
            'success': True,
            'valid': True,
            'paymentLink': {
                'id': str(payment_link.id),
                'clientName': payment_link.client_name,
                'policyNumber': payment_link.policy_number,
                'amount': amount_val,
                'status': payment_link.status,
                'expiresAt': payment_link.expires_at.isoformat() if payment_link.expires_at else None,
                'createdAt': payment_link.created_at.isoformat() if payment_link.created_at else None,
            },
            'productData': {
                'productName': product.get('title', product.get('name', 'Insurance Product')),
                'productPrice': amount_val,
                'productDescription': product.get('short_description', product.get('description', '')),
                'productType': product_type,
                'customerDetails': {
                    'name': customer_details.get('name', payment_link.client_name),
                    'email': customer_details.get('email', ''),
                    'phoneNumber': customer_details.get('phoneNumber', ''),
                    'idNumber': customer_details.get('idNumber', ''),
                },
                'policyDetails': policy_details,
            },
            'companyInfo': company_info,
            'expiryTime': payment_link.expires_at.isoformat() if payment_link.expires_at else None,
        })

    except Exception as e:
        return Response({
            'success': False,
            'message': f'Error looking up payment link: {str(e)}',
            'valid': False,
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def mpesa_initiate_payment(request):
    """
    Initiate M-Pesa STK Push payment
    """
    try:
        data = request.data
        phone_number = data.get('phoneNumber', '')
        amount = data.get('amount', 0)
        product_name = data.get('productName', 'Insurance')
        payment_link_token = data.get('paymentLinkToken', '')

        if not phone_number:
            return Response({
                'success': False,
                'message': 'Phone number is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            amount_val = int(round(float(amount)))
        except (ValueError, TypeError):
            return Response({
                'success': False,
                'message': 'Invalid payment amount'
            }, status=status.HTTP_400_BAD_REQUEST)

        if amount_val < 1:
            return Response({
                'success': False,
                'message': 'Payment amount must be at least KES 1'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Initiate STK push
        account_ref = f"INS-{payment_link_token[:8]}" if payment_link_token else "INS-PAY"
        transaction_desc = f"Insurance Payment"

        checkout_id, error = initiate_stk_push(phone_number, amount_val, transaction_desc, account_ref)

        if checkout_id:
            # Generate a local transaction reference
            txn_id = str(uuid.uuid4())

            # Store transaction in PaymentLink meta or create a log entry
            # For now, create a PremiumPaymentLog entry
            try:
                PremiumPaymentLog.objects.create(
                    log_no=f"MPESA-{datetime.now().strftime('%Y%m%d%H%M%S')}",
                    client_name=data.get('customerDetails', {}).get('name', 'Unknown'),
                    policy_number=data.get('policyDetails', {}).get('policy_number', ''),
                    amount=amount_val,
                    payment_method='M-Pesa',
                    payment_date=datetime.now().date(),
                    status='Processing',
                    notes=json.dumps({
                        'checkout_request_id': checkout_id,
                        'transaction_id': txn_id,
                        'phone_number': phone_number,
                        'payment_link_token': payment_link_token,
                    })
                )
            except Exception as e:
                logger.warning(f"Could not create payment log: {e}")

            return Response({
                'success': True,
                'transactionId': txn_id,
                'checkoutRequestId': checkout_id,
                'message': 'M-Pesa prompt sent to your phone. Please enter your PIN to complete payment.'
            })
        else:
            return Response({
                'success': False,
                'message': error or 'Failed to initiate M-Pesa payment. Please try again.'
            }, status=status.HTTP_502_BAD_GATEWAY)

    except Exception as e:
        logger.error(f"M-Pesa initiate payment error: {e}")
        return Response({
            'success': False,
            'message': f'Payment initiation failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def mpesa_payment_status(request, transaction_id):
    """
    Check payment status. In production, this would query the M-Pesa API.
    For now, we check the latest PremiumPaymentLog.
    """
    try:
        # Look for the transaction in the payment logs
        log = PremiumPaymentLog.objects.filter(
            notes__contains=transaction_id
        ).order_by('-created_at').first()

        if not log:
            return Response({
                'success': True,
                'status': 'pending',
                'message': 'Transaction not yet confirmed'
            })

        if log.status == 'Completed':
            return Response({
                'success': True,
                'status': 'completed',
                'transactionId': transaction_id,
                'amount': float(log.amount),
                'message': 'Payment completed successfully'
            })
        elif log.status == 'Failed':
            return Response({
                'success': True,
                'status': 'failed',
                'message': 'Payment failed'
            })
        else:
            return Response({
                'success': True,
                'status': 'pending',
                'message': 'Payment is being processed'
            })

    except Exception as e:
        logger.error(f"Payment status error: {e}")
        return Response({
            'success': False,
            'status': 'error',
            'message': f'Error checking payment status: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def mpesa_callback(request):
    """
    M-Pesa STK Push callback URL - receives payment confirmation from Safaricom
    """
    try:
        callback_data = request.data
        logger.info(f"M-Pesa callback received: {json.dumps(callback_data)}")

        # Extract the body items
        body = callback_data.get('Body', {})
        stk_callback = body.get('stkCallback', {})
        result_code = stk_callback.get('ResultCode', 1)
        checkout_request_id = stk_callback.get('CheckoutRequestID', '')
        result_desc = stk_callback.get('ResultDesc', '')

        # Find the payment log with this checkout request ID
        log = PremiumPaymentLog.objects.filter(
            notes__contains=checkout_request_id
        ).order_by('-created_at').first()

        if log:
            if result_code == 0:
                # Payment successful - extract metadata
                callback_metadata = stk_callback.get('CallbackMetadata', {})
                items = callback_metadata.get('Item', [])
                mpesa_receipt = ''
                phone_number = ''
                amount = 0

                for item in items:
                    name = item.get('Name', '')
                    value = item.get('Value', '')
                    if name == 'MpesaReceiptNumber':
                        mpesa_receipt = value
                    elif name == 'PhoneNumber':
                        phone_number = value
                    elif name == 'Amount':
                        amount = value

                log.status = 'Completed'
                additional_notes = json.loads(log.notes) if log.notes else {}
                additional_notes.update({
                    'mpesa_receipt': mpesa_receipt,
                    'result_code': result_code,
                    'result_desc': result_desc,
                })
                log.notes = json.dumps(additional_notes)
                log.save(update_fields=['status', 'notes'])

                # Also update PaymentLink status if applicable
                notes_data = json.loads(log.notes) if isinstance(log.notes, str) else {}
                payment_link_token = notes_data.get('payment_link_token', '')
                if payment_link_token:
                    PaymentLink.objects.filter(
                        link_url__contains=f'/pay/{payment_link_token}'
                    ).update(status='Completed')

                # Create a CustomerReceipt for the successful payment
                try:
                    receipt_no = f"RCP-{mpesa_receipt}" if mpesa_receipt else f"RCP-{uuid.uuid4().hex[:8].upper()}"
                    CustomerReceipt.objects.create(
                        receipt_no=receipt_no,
                        client_name=log.client_name,
                        policy_number=log.policy_number,
                        amount=log.amount,
                        payment_method='M-Pesa',
                        receipt_date=timezone.now().date(),
                        notes=json.dumps({
                            'mpesa_receipt': mpesa_receipt,
                            'payment_log_id': str(log.id),
                            'transaction_type': 'M-Pesa STK Push',
                        })
                    )
                except Exception as e:
                    logger.warning(f"Could not create customer receipt: {e}")
            else:
                # Payment failed
                log.status = 'Failed'
                additional_notes = json.loads(log.notes) if log.notes else {}
                additional_notes.update({
                    'result_code': result_code,
                    'result_desc': result_desc,
                })
                log.notes = json.dumps(additional_notes)
                log.save(update_fields=['status', 'notes'])

        return Response({
            'ResultCode': 0,
            'ResultDesc': 'Success'
        })

    except Exception as e:
        logger.error(f"M-Pesa callback error: {e}")
        return Response({
            'ResultCode': 1,
            'ResultDesc': 'Internal error'
        })


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def receipt_by_transaction(request, transaction_id):
    """
    Look up a receipt by the M-Pesa transaction ID.
    """
    try:
        # Try to find the receipt directly from notes containing the transaction_id
        receipt = CustomerReceipt.objects.filter(
            notes__contains=transaction_id
        ).first()

        if not receipt:
            # Fallback: find the payment log first, then look for linked receipt
            log = PremiumPaymentLog.objects.filter(
                notes__contains=transaction_id
            ).order_by('-created_at').first()
            if log and log.notes:
                notes_data = json.loads(log.notes) if isinstance(log.notes, str) else {}
                mpesa_receipt = notes_data.get('mpesa_receipt', '')
                if mpesa_receipt:
                    receipt = CustomerReceipt.objects.filter(
                        notes__contains=mpesa_receipt
                    ).first()

        if not receipt:
            return Response({
                'success': False,
                'message': 'Receipt not found'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = CustomerReceiptSerializer(receipt)
        return Response({
            'success': True,
            'data': serializer.data,
            'receiptId': str(receipt.id),
        })

    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def download_receipt(request, receipt_id):
    """
    Generate and download a professional PDF receipt with company branding.
    """
    try:
        receipt = CustomerReceipt.objects.get(id=receipt_id)
    except CustomerReceipt.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Receipt not found'
        }, status=status.HTTP_404_NOT_FOUND)

    # Try to find company info from payment context
    company = None
    payment_link = None
    try:
        # Look up payment links that have this receipt's policy number or client
        payment_link = PaymentLink.objects.filter(
            policy_number=receipt.policy_number,
            client_name=receipt.client_name,
        ).order_by('-created_at').first()
        if payment_link and payment_link.meta:
            company_data = payment_link.meta.get('company', {})
    except Exception:
        company_data = {}

    # Build receipt HTML
    receipt_date = receipt.receipt_date or timezone.now().date()
    company_name = company_data.get('display_name', company_data.get('name', 'Starzed Insurance'))
    company_logo = company_data.get('logo', '')
    company_contact = company_data.get('contact', {})
    company_website = company_data.get('website', '')
    company_hq = company_data.get('headquarters', '')

    notes_data = {}
    if receipt.notes:
        try:
            notes_data = json.loads(receipt.notes) if isinstance(receipt.notes, str) else receipt.notes
        except (json.JSONDecodeError, TypeError):
            pass

    mpesa_receipt = notes_data.get('mpesa_receipt', '')
    amount_formatted = f"KES {float(receipt.amount):,.2f}"

    html = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @page {{
    size: A4;
    margin: 15mm;
  }}
  body {{
    font-family: 'Helvetica', 'Arial', sans-serif;
    color: #1a1a1a;
    font-size: 12px;
    line-height: 1.5;
  }}
  .header {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 3px solid #1e3a5f;
    padding-bottom: 20px;
    margin-bottom: 25px;
  }}
  .header-left {{
    display: flex;
    align-items: center;
    gap: 15px;
  }}
  .company-logo {{
    max-height: 60px;
    max-width: 120px;
  }}
  .company-name {{
    font-size: 22px;
    font-weight: bold;
    color: #1e3a5f;
    margin: 0;
  }}
  .company-details {{
    font-size: 10px;
    color: #666;
    margin-top: 3px;
  }}
  .receipt-title {{
    text-align: right;
    font-size: 26px;
    font-weight: bold;
    color: #1e3a5f;
    margin: 0;
  }}
  .receipt-subtitle {{
    text-align: right;
    font-size: 12px;
    color: #888;
  }}
  .info-section {{
    display: flex;
    justify-content: space-between;
    margin-bottom: 25px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 6px;
  }}
  .info-block h4 {{
    margin: 0 0 6px 0;
    font-size: 11px;
    text-transform: uppercase;
    color: #888;
    letter-spacing: 0.5px;
  }}
  .info-block p {{
    margin: 2px 0;
    font-size: 13px;
  }}
  .amount-box {{
    text-align: center;
    background: #1e3a5f;
    color: white;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 25px;
  }}
  .amount-box .label {{
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    opacity: 0.8;
  }}
  .amount-box .value {{
    font-size: 32px;
    font-weight: bold;
    margin: 5px 0;
  }}
  .details-table {{
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 25px;
  }}
  .details-table th {{
    text-align: left;
    padding: 8px 12px;
    background: #f0f2f5;
    font-size: 11px;
    text-transform: uppercase;
    color: #555;
    border-bottom: 2px solid #ddd;
  }}
  .details-table td {{
    padding: 8px 12px;
    border-bottom: 1px solid #eee;
    font-size: 12px;
  }}
  .details-table td:last-child {{
    text-align: right;
    font-weight: 600;
  }}
  .footer {{
    margin-top: 30px;
    padding-top: 15px;
    border-top: 1px solid #ddd;
    text-align: center;
    font-size: 10px;
    color: #999;
  }}
  .footer p {{ margin: 3px 0; }}
  .badge {{
    display: inline-block;
    background: #e8f5e9;
    color: #2e7d32;
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: bold;
  }}
</style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      {'<img src="' + company_logo + '" class="company-logo" alt="Logo"/>' if company_logo else ''}
      <div>
        <div class="company-name">{company_name}</div>
        <div class="company-details">{company_hq}<br/>{company_website}</div>
      </div>
    </div>
    <div>
      <div class="receipt-title">RECEIPT</div>
      <div class="receipt-subtitle">#{receipt.receipt_no}</div>
    </div>
  </div>

  <div class="info-section">
    <div class="info-block">
      <h4>Receipt Date</h4>
      <p>{receipt_date}</p>
    </div>
    <div class="info-block">
      <h4>Client Name</h4>
      <p>{receipt.client_name}</p>
    </div>
    <div class="info-block">
      <h4>Policy Number</h4>
      <p>{receipt.policy_number or 'N/A'}</p>
    </div>
    <div class="info-block">
      <h4>Payment Method</h4>
      <p>{receipt.payment_method or 'M-Pesa'}</p>
    </div>
  </div>

  <div class="amount-box">
    <div class="label">Total Amount Paid</div>
    <div class="value">{amount_formatted}</div>
    <div style="font-size:12px;opacity:0.9;">Payment Completed Successfully</div>
  </div>

  <table class="details-table">
    <tr>
      <th>Description</th>
      <th style="text-align:right;">Amount</th>
    </tr>
    <tr>
      <td>Insurance Premium Payment</td>
      <td>{amount_formatted}</td>
    </tr>
    <tr>
      <td>Processing Fee</td>
      <td>Free</td>
    </tr>
    <tr style="background:#f8f9fa;font-weight:bold;">
      <td>Total Paid</td>
      <td>{amount_formatted}</td>
    </tr>
  </table>

  {'<p><span class="badge">M-Pesa Receipt: ' + mpesa_receipt + '</span></p>' if mpesa_receipt else ''}

  <div class="footer">
    <p><strong>{company_name}</strong></p>
    <p>{company_hq}</p>
    <p>{company_website} | {company_contact.get('email', '')} | {company_contact.get('phone', '')}</p>
    <p>Thank you for trusting {company_name}. This is a system-generated receipt.</p>
  </div>
</body>
</html>"""

    from django.http import HttpResponse
    return HttpResponse(html, content_type='text/html')


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def mpesa_debug_config(request):
    """
    Debug endpoint to verify M-Pesa configuration without making API calls.
    NEVER expose this in production — it returns credentials for troubleshooting.
    """
    ck = get_mpesa_consumer_key()
    cs = get_mpesa_consumer_secret()
    return Response({
        'MPESA_CONSUMER_KEY_set': bool(ck),
        'MPESA_CONSUMER_KEY_prefix': ck[:8] + '...' if ck else '',
        'MPESA_CONSUMER_SECRET_set': bool(cs),
        'MPESA_CONSUMER_SECRET_prefix': cs[:8] + '...' if cs else '',
        'MPESA_ENVIRONMENT': get_mpesa_environment(),
        'MPESA_SHORTCODE': get_mpesa_shortcode(),
        'MPESA_TILL_NUMBER': MPESA_TILL_NUMBER,
        'SITE_URL': getattr(settings, 'SITE_URL', 'not set'),
        'DJANGO_SETTINGS_MODULE': getattr(settings, 'SETTINGS_MODULE', 'N/A'),
    })


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def mpesa_debug_test_auth(request):
    """
    Test M-Pesa connectivity by actually requesting an access token.
    Returns the result without attempting an STK push.
    """
    token = get_mpesa_access_token()
    if token:
        return Response({
            'success': True,
            'token_prefix': token[:20] + '...' if token else '',
            'environment': get_mpesa_environment(),
            'base_url': get_mpesa_base_url(),
        })
    else:
        return Response({
            'success': False,
            'message': 'Failed to get access token. Check credentials.',
            'environment': get_mpesa_environment(),
            'base_url': get_mpesa_base_url(),
        }, status=status.HTTP_401_UNAUTHORIZED)
