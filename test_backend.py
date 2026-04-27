#!/usr/bin/env python3
"""
Ultra-simple test backend to diagnose deployment issues
"""
import os
import sys
import time
import json
import base64
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

print("Python version:", sys.version)
print("Current directory:", os.getcwd())
print("Python path:", sys.path)

try:
    from flask import Flask, jsonify, request
    from flask_cors import CORS
    from datetime import datetime, timedelta
    print("Flask import: OK")
except ImportError as e:
    print("Flask import: FAILED -", e)
    sys.exit(1)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# M-Pesa Configuration
MPESA_CONSUMER_KEY = os.getenv('MPESA_CONSUMER_KEY', '')
MPESA_CONSUMER_SECRET = os.getenv('MPESA_CONSUMER_SECRET', '')
MPESA_PASSKEY = os.getenv('MPESA_PASSKEY', '')
MPESA_SHORTCODE = os.getenv('MPESA_SHORTCODE', '174379')
MPESA_CALLBACK_URL = os.getenv('MPESA_CALLBACK_URL', 'http://localhost:8000/api/mpesa/callback')
MPESA_ENVIRONMENT = os.getenv('MPESA_ENVIRONMENT', 'sandbox')

# M-Pesa API URLs
if MPESA_ENVIRONMENT == 'production':
    MPESA_BASE_URL = 'https://api.safaricom.co.ke'
else:
    MPESA_BASE_URL = 'https://sandbox.safaricom.co.ke'

# Global variable to store access token
mpesa_access_token = None
mpesa_token_expiry = 0

def get_mpesa_access_token():
    """Get OAuth access token from M-Pesa"""
    global mpesa_access_token, mpesa_token_expiry
    
    # Check if token is still valid (with 5-minute buffer)
    current_time = time.time()
    if mpesa_access_token and current_time < (mpesa_token_expiry - 300):
        return mpesa_access_token
    
    if not MPESA_CONSUMER_KEY or not MPESA_CONSUMER_SECRET:
        print("⚠️  M-Pesa credentials not found, using test mode")
        return None
    
    try:
        url = f"{MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials"
        
        # Create basic auth header
        auth_string = f"{MPESA_CONSUMER_KEY}:{MPESA_CONSUMER_SECRET}"
        auth_bytes = auth_string.encode('ascii')
        auth_b64 = base64.b64encode(auth_bytes)
        
        headers = {
            'Authorization': f'Basic {auth_b64.decode("ascii")}'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            token_data = response.json()
            mpesa_access_token = token_data['access_token']
            mpesa_token_expiry = current_time + 3600  # Token expires in 1 hour
            print(f"✅ M-Pesa access token obtained successfully")
            return mpesa_access_token
        else:
            print(f"❌ Failed to get M-Pesa access token: {response.status_code}")
            print(f"Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error getting M-Pesa access token: {e}")
        return None

def initiate_real_stk_push(phone_number, amount, account_reference, transaction_desc):
    """Initiate real STK push to M-Pesa"""
    
    access_token = get_mpesa_access_token()
    if not access_token:
        return None
    
    if not MPESA_PASSKEY or MPESA_PASSKEY == 'N/A':
        print("⚠️  M-Pesa passkey not configured, using test mode")
        return None
    
    try:
        # Format phone number (remove leading 0 and add 254)
        if phone_number.startswith('0'):
            phone_number = '254' + phone_number[1:]
        
        # Generate password
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        password_string = f"{MPESA_SHORTCODE}{MPESA_PASSKEY}{timestamp}"
        password = base64.b64encode(password_string.encode()).decode()
        
        url = f"{MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest"
        
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'BusinessShortCode': MPESA_SHORTCODE,
            'Password': password,
            'Timestamp': timestamp,
            'TransactionType': 'CustomerPayBillOnline',
            'Amount': amount,
            'PartyA': phone_number,
            'PartyB': MPESA_SHORTCODE,
            'PhoneNumber': phone_number,
            'CallBackURL': MPESA_CALLBACK_URL,
            'AccountReference': account_reference,
            'TransactionDesc': transaction_desc
        }
        
        print(f"📡 Sending real STK push to {phone_number}...")
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            print(f"📋 M-Pesa STK Response: {result}")
            
            if result.get('ResponseCode') == '0':
                print(f"✅ STK push initiated successfully!")
                print(f"🎉 Check your phone for the M-Pesa prompt!")
                return {
                    'success': True,
                    'transactionId': result.get('CheckoutRequestID'),
                    'message': 'M-Pesa prompt sent successfully',
                    'merchantRequestID': result.get('MerchantRequestID'),
                    'checkoutRequestID': result.get('CheckoutRequestID'),
                    'responseCode': result.get('ResponseCode'),
                    'responseDescription': result.get('ResponseDescription')
                }
            else:
                print(f"❌ STK push failed: {result.get('ResponseDescription')}")
                return {
                    'success': False,
                    'message': result.get('ResponseDescription', 'STK push failed'),
                    'responseCode': result.get('ResponseCode')
                }
        else:
            print(f"❌ STK push HTTP error: {response.status_code}")
            print(f"Response: {response.text}")
            return {
                'success': False,
                'message': f'HTTP error: {response.status_code}'
            }
            
    except Exception as e:
        print(f"❌ Error initiating STK push: {e}")
        return {
            'success': False,
            'message': f'Error: {str(e)}'
        }

@app.route('/')
def home():
    return "Backend is working!"

@app.route('/api/health/')
def health():
    return "Health check OK"

@app.route('/api/clients/')
def clients():
    return jsonify({
        'success': True,
        'clients': [
            {'id': 1, 'name': 'John Kamau', 'email': 'john@example.com', 'phone': '+254712345678'},
            {'id': 2, 'name': 'Mary Wanjiku', 'email': 'mary@example.com', 'phone': '+254723456789'}
        ]
    })

@app.route('/api/clients/search', methods=['GET'])
def search_clients():
    """Search clients by name, email, or phone"""
    try:
        query = request.args.get('q', '').lower()
        
        # Mock client data
        clients = [
            {
                'id': 1,
                'name': 'John Kamau',
                'email': 'john.kamau@example.com',
                'phone': '+254712345678',
                'idNumber': '12345678',
                'address': 'Nairobi, Kenya'
            },
            {
                'id': 2,
                'name': 'Mary Wanjiku',
                'email': 'mary.wanjiku@example.com',
                'phone': '+254723456789',
                'idNumber': '87654321',
                'address': 'Mombasa, Kenya'
            },
            {
                'id': 3,
                'name': 'David Ochieng',
                'email': 'david.ochieng@example.com',
                'phone': '+254734567890',
                'idNumber': '45678912',
                'address': 'Kisumu, Kenya'
            },
            {
                'id': 4,
                'name': 'Grace Njeri',
                'email': 'grace.njeri@example.com',
                'phone': '+254745678901',
                'idNumber': '78912345',
                'address': 'Nakuru, Kenya'
            },
            {
                'id': 5,
                'name': 'Peter Mwangi',
                'email': 'peter.mwangi@example.com',
                'phone': '+254756789012',
                'idNumber': '34567890',
                'address': 'Eldoret, Kenya'
            }
        ]
        
        # Filter clients based on search query
        if query:
            filtered_clients = []
            for client in clients:
                if (query in client['name'].lower() or 
                    query in client['email'].lower() or 
                    query in client['phone']):
                    filtered_clients.append(client)
            return jsonify({
                'success': True,
                'clients': filtered_clients
            })
        else:
            return jsonify({
                'success': True,
                'clients': clients[:5]  # Return first 5 if no query
            })
            
    except Exception as e:
        print(f"Client search error: {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to search clients'}), 500

@app.route('/api/clients/<int:client_id>/policies', methods=['GET'])
def get_client_policies(client_id):
    """Get policies for a specific client"""
    try:
        # Mock policy data based on client
        policies = {
            1: [
                {
                    'id': 1,
                    'policyNumber': 'POL-2024-001',
                    'policyType': 'Comprehensive Motor Insurance',
                    'coverage': 'Full vehicle coverage',
                    'premium': 50000,
                    'status': 'active',
                    'startDate': '2024-01-01',
                    'endDate': '2024-12-31',
                    'companyId': 1
                },
                {
                    'id': 2,
                    'policyNumber': 'POL-2024-002',
                    'policyType': 'Third Party Motor Insurance',
                    'coverage': 'Basic liability coverage',
                    'premium': 25000,
                    'status': 'active',
                    'startDate': '2024-01-15',
                    'endDate': '2025-01-14',
                    'companyId': 2
                }
            ],
            2: [
                {
                    'id': 3,
                    'policyNumber': 'POL-2024-003',
                    'policyType': 'Individual Medical Cover',
                    'coverage': 'Comprehensive health insurance',
                    'premium': 75000,
                    'status': 'active',
                    'startDate': '2024-01-01',
                    'endDate': '2024-12-31',
                    'companyId': 3
                }
            ],
            3: [
                {
                    'id': 4,
                    'policyNumber': 'POL-2024-004',
                    'policyType': 'Family Medical Cover',
                    'coverage': 'Family health insurance',
                    'premium': 150000,
                    'status': 'active',
                    'startDate': '2024-01-01',
                    'endDate': '2024-12-31',
                    'companyId': 4
                }
            ],
            4: [
                {
                    'id': 5,
                    'policyNumber': 'POL-2024-005',
                    'policyType': 'Travel Insurance',
                    'coverage': 'International travel coverage',
                    'premium': 20000,
                    'status': 'active',
                    'startDate': '2024-01-01',
                    'endDate': '2024-12-31',
                    'companyId': 5
                }
            ],
            5: [
                {
                    'id': 6,
                    'policyNumber': 'POL-2024-006',
                    'policyType': 'Home Insurance',
                    'coverage': 'Comprehensive home coverage',
                    'premium': 45000,
                    'status': 'active',
                    'startDate': '2024-01-01',
                    'endDate': '2024-12-31',
                    'companyId': 1
                }
            ]
        }
        
        client_policies = policies.get(client_id, [])
        return jsonify({
            'success': True,
            'policies': client_policies
        })
        
    except Exception as e:
        print(f"Client policies fetch error: {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to fetch client policies'}), 500

@app.route('/api/companies/', methods=['GET'])
def get_companies():
    """Get all insurance companies"""
    try:
        companies = [
            {
                'id': 1,
                'name': 'Jubilee Insurance',
                'type': 'Insurance Company',
                'logo': 'jubilee',
                'description': 'Leading insurance provider in Kenya'
            },
            {
                'id': 2,
                'name': 'Britam Insurance',
                'type': 'Insurance Company', 
                'logo': 'britam',
                'description': 'Comprehensive insurance solutions'
            },
            {
                'id': 3,
                'name': 'UAP Old Mutual',
                'type': 'Insurance Company',
                'logo': 'uap',
                'description': 'Trusted insurance partner'
            },
            {
                'id': 4,
                'name': 'APA Insurance',
                'type': 'Insurance Company',
                'logo': 'apa',
                'description': 'Affordable insurance products'
            },
            {
                'id': 5,
                'name': 'CIC Insurance',
                'type': 'Insurance Company',
                'logo': 'cic',
                'description': 'Innovative insurance solutions'
            }
        ]
        
        return jsonify({
            'success': True,
            'companies': companies
        })
        
    except Exception as e:
        print(f"Companies fetch error: {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to fetch companies'}), 500

@app.route('/api/payments/initiate/', methods=['POST'])
def payment_initiate():
    """Initiate M-Pesa STK push payment"""
    try:
        data = request.get_json()
        
        # Extract payment details
        phone_number = data.get('phone_number')
        amount = data.get('amount', 10)
        account_reference = data.get('account_reference', 'STARZED')
        transaction_desc = data.get('transaction_desc', 'Payment for Starzed Insurance')
        
        if not phone_number:
            return jsonify({
                'success': False,
                'message': 'Phone number is required'
            }), 400
        
        print(f"📱 Processing payment request for {phone_number}, amount KES {amount}")
        
        # Try real M-Pesa integration first
        real_result = initiate_real_stk_push(phone_number, amount, account_reference, transaction_desc)
        
        if real_result:
            return jsonify(real_result)
        else:
            # Fallback to test mode if real M-Pesa fails
            print("⚠️  Falling back to test mode")
            return jsonify({
                'success': True,
                'transactionId': 'test-transaction-' + str(int(time.time())),
                'message': 'M-Pesa prompt sent (test mode - real M-Pesa unavailable)'
            })
            
    except Exception as e:
        print(f"❌ Payment initiation error: {e}")
        return jsonify({
            'success': False,
            'message': f'Payment initiation failed: {str(e)}'
        }), 500

@app.route('/api/payments/status/<transaction_id>/', methods=['GET'])
def payment_status(transaction_id):
    # Simulate payment completion after 10 seconds
    if int(time.time()) % 2 == 0:
        return jsonify({
            'success': True,
            'status': 'completed',
            'mpesa_receipt_number': 'TEST' + str(int(time.time())),
            'created_at': '2024-01-01T12:00:00'
        })
    else:
        return jsonify({
            'success': True,
            'status': 'pending',
            'mpesa_receipt_number': None,
            'created_at': '2024-01-01T12:00:00'
        })


@app.route('/api/payments/validate-link/<token>/', methods=['GET'])
def validate_payment_link(token):
    """Validate secure payment link"""
    try:
        hash_param = request.args.get('hash')
        
        if not hash_param:
            return jsonify({'success': False, 'message': 'Invalid link format'}), 400
        
        # In production, retrieve from database using token
        # For now, simulate validation
        import hashlib
        from datetime import datetime, timedelta
        
        # Simulate stored data (in production, get from database)
        simulated_expiry = datetime.now() + timedelta(hours=24)
        simulated_product = {
            'productName': 'Test Insurance Product',
            'productType': 'motor',
            'productPrice': 50000,
            'productDescription': 'Comprehensive motor insurance cover',
            'customerDetails': {
                'name': 'John Doe',
                'email': 'john@example.com',
                'idNumber': '12345678'
            },
            'policyDetails': {
                'vehicleMake': 'Toyota',
                'vehicleModel': 'Corolla',
                'vehicleYear': '2020',
                'registrationNumber': 'KAB 123A'
            }
        }
        
        # Check if link has expired
        if datetime.now() > simulated_expiry:
            return jsonify({'success': False, 'message': 'Payment link has expired'}), 400
        
        # Validate hash
        hash_data = f"{token}:{simulated_expiry.timestamp()}:{simulated_product['productName']}"
        expected_hash = hashlib.sha256(hash_data.encode()).hexdigest()
        
        if hash_param != expected_hash:
            return jsonify({'success': False, 'message': 'Invalid payment link'}), 400
        
        return jsonify({
            'success': True,
            'valid': True,
            'productData': simulated_product,
            'expiryTime': simulated_expiry.isoformat()
        })
        
    except Exception as e:
        print(f"Link validation error: {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to validate payment link'}), 500


@app.route('/api/payments/send-link-email/', methods=['POST'])
def send_link_email():
    """Send payment link via email"""
    try:
        data = request.get_json()
        
        # In production, integrate with actual email service
        # For now, simulate email sending
        print(f"Sending email to: {data['to']}")
        print(f"Customer: {data['customerName']}")
        print(f"Product: {data['productName']}")
        print(f"Price: {data['productPrice']}")
        print(f"Payment Link: {data['paymentLink']}")
        print(f"Expires in: {data['expiryHours']} hours")
        
        return jsonify({
            'success': True,
            'message': 'Payment link sent successfully'
        })
        
    except Exception as e:
        print(f"Email sending error: {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to send email'}), 500

@app.route('/api/products/', methods=['GET'])
def get_products():
    """Get available products"""
    try:
        # Simulate product data
        products = [
            {
                'id': 1,
                'name': 'Comprehensive Motor Insurance',
                'description': 'Full coverage for your vehicle',
                'type': 'motor',
                'price': 50000
            },
            {
                'id': 2,
                'name': 'Third Party Motor Insurance',
                'description': 'Basic coverage as required by law',
                'type': 'motor',
                'price': 25000
            },
            {
                'id': 3,
                'name': 'Individual Medical Cover',
                'description': 'Comprehensive health insurance',
                'type': 'medical',
                'price': 75000
            },
            {
                'id': 4,
                'name': 'Family Medical Cover',
                'description': 'Health insurance for the whole family',
                'type': 'medical',
                'price': 150000
            }
        ]
        
        return jsonify({
            'success': True,
            'products': products
        })
        
    except Exception as e:
        print(f"Products fetch error: {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to fetch products'}), 500

@app.route('/api/certificates/', methods=['GET'])
def get_certificates():
    """Get all certificates with their status"""
    try:
        # Simulate database query for certificates
        certificates = [
            {
                'id': 1,
                'certificate_no': 'CERT-2024-001',
                'insurer': 'Jubilee Insurance',
                'date': '2024-01-15',
                'user_name': 'John Kamau',
                'status': 'active',
                'item': 'Motor Vehicle',
                'd_expiry': '2025-01-15',
                'amount': 25000,
                'policy_id': 'POL-2024-001',
                'client_id': 1
            },
            {
                'id': 2,
                'certificate_no': 'CERT-2024-002',
                'insurer': 'Britam Insurance',
                'date': '2024-01-16',
                'user_name': 'Mary Wanjiku',
                'status': 'expired',
                'item': 'Health Insurance',
                'd_expiry': '2024-01-16',
                'amount': 15000,
                'policy_id': 'POL-2024-002',
                'client_id': 2
            },
            {
                'id': 3,
                'certificate_no': 'CERT-2024-003',
                'insurer': 'UAP Old Mutual',
                'date': '2024-01-17',
                'user_name': 'David Ochieng',
                'status': 'active',
                'item': 'Life Insurance',
                'd_expiry': '2025-01-17',
                'amount': 35000,
                'policy_id': 'POL-2024-003',
                'client_id': 3
            },
            {
                'id': 4,
                'certificate_no': 'CERT-2024-004',
                'insurer': 'APA Insurance',
                'date': '2024-01-18',
                'user_name': 'Grace Njeri',
                'status': 'pending',
                'item': 'Travel Insurance',
                'd_expiry': '2025-01-18',
                'amount': 20000,
                'policy_id': 'POL-2024-004',
                'client_id': 4
            },
            {
                'id': 5,
                'certificate_no': 'CERT-2024-005',
                'insurer': 'CIC Insurance',
                'date': '2024-01-19',
                'user_name': 'Peter Mwangi',
                'status': 'active',
                'item': 'Home Insurance',
                'd_expiry': '2025-01-19',
                'amount': 45000,
                'policy_id': 'POL-2024-005',
                'client_id': 5
            }
        ]
        
        return jsonify({
            'success': True,
            'certificates': certificates
        })
        
    except Exception as e:
        print(f"Certificates fetch error: {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to fetch certificates'}), 500

@app.route('/api/certificates/<int:certificate_id>/', methods=['GET'])
def get_certificate(certificate_id):
    """Get a specific certificate by ID"""
    try:
        # Simulate database query for specific certificate
        certificates = {
            1: {
                'id': 1,
                'certificate_no': 'CERT-2024-001',
                'insurer': 'Jubilee Insurance',
                'date': '2024-01-15',
                'user_name': 'John Kamau',
                'status': 'active',
                'item': 'Motor Vehicle',
                'd_expiry': '2025-01-15',
                'amount': 25000,
                'policy_id': 'POL-2024-001',
                'client_id': 1
            }
        }
        
        certificate = certificates.get(certificate_id)
        if not certificate:
            return jsonify({'success': False, 'message': 'Certificate not found'}), 404
        
        return jsonify({
            'success': True,
            'certificate': certificate
        })
        
    except Exception as e:
        print(f"Certificate fetch error: {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to fetch certificate'}), 500

@app.route('/api/certificates/<int:certificate_id>/', methods=['PUT'])
def update_certificate(certificate_id):
    """Update certificate status and details"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['certificate_no', 'insurer', 'user_name', 'status', 'item', 'd_expiry', 'amount']
        for field in required_fields:
            if field not in data:
                return jsonify({'success': False, 'message': f'Missing field: {field}'}), 400
        
        # Simulate database update
        print(f"Updating certificate {certificate_id} with data: {data}")
        
        return jsonify({
            'success': True,
            'message': 'Certificate updated successfully',
            'certificate': {
                'id': certificate_id,
                **data
            }
        })
        
    except Exception as e:
        print(f"Certificate update error: {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to update certificate'}), 500

@app.route('/api/certificates/<int:certificate_id>/', methods=['DELETE'])
def delete_certificate(certificate_id):
    """Delete a certificate"""
    try:
        # Simulate database deletion
        print(f"Deleting certificate {certificate_id}")
        
        return jsonify({
            'success': True,
            'message': 'Certificate deleted successfully'
        })
        
    except Exception as e:
        print(f"Certificate delete error: {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to delete certificate'}), 500

@app.route('/api/certificates/search/', methods=['GET'])
def search_certificates():
    """Search certificates by various criteria"""
    try:
        query = request.args.get('q', '').lower()
        status = request.args.get('status', '')
        
        # Simulate database search
        all_certificates = [
            {
                'id': 1,
                'certificate_no': 'CERT-2024-001',
                'insurer': 'Jubilee Insurance',
                'date': '2024-01-15',
                'user_name': 'John Kamau',
                'status': 'active',
                'item': 'Motor Vehicle',
                'd_expiry': '2025-01-15',
                'amount': 25000,
                'policy_id': 'POL-2024-001',
                'client_id': 1
            },
            {
                'id': 2,
                'certificate_no': 'CERT-2024-002',
                'insurer': 'Britam Insurance',
                'date': '2024-01-16',
                'user_name': 'Mary Wanjiku',
                'status': 'expired',
                'item': 'Health Insurance',
                'd_expiry': '2024-01-16',
                'amount': 15000,
                'policy_id': 'POL-2024-002',
                'client_id': 2
            }
        ]
        
        # Filter certificates based on search criteria
        filtered_certificates = []
        for cert in all_certificates:
            matches_query = True
            matches_status = True
            
            if query:
                matches_query = (
                    query in cert['certificate_no'].lower() or
                    query in cert['user_name'].lower() or
                    query in cert['insurer'].lower()
                )
            
            if status:
                matches_status = cert['status'] == status
            
            if matches_query and matches_status:
                filtered_certificates.append(cert)
        
        return jsonify({
            'success': True,
            'certificates': filtered_certificates
        })
        
    except Exception as e:
        print(f"Certificate search error: {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to search certificates'}), 500

# Customer Receipts API Endpoints
@app.route('/api/customer-receipts/', methods=['GET'])
def get_customer_receipts():
    """Get all customer receipts"""
    try:
        receipts = [
            {
                'id': 1,
                'receipt_number': 'RCP-2024-001',
                'customer_name': 'John Kamau',
                'policy_number': 'POL-2024-001',
                'amount': 25000,
                'payment_date': '2024-01-15',
                'payment_method': 'M-Pesa',
                'status': 'completed',
                'insurer': 'Jubilee Insurance',
                'description': 'Motor Insurance Premium'
            },
            {
                'id': 2,
                'receipt_number': 'RCP-2024-002',
                'customer_name': 'Mary Wanjiku',
                'policy_number': 'POL-2024-002',
                'amount': 15000,
                'payment_date': '2024-01-16',
                'payment_method': 'Bank Transfer',
                'status': 'completed',
                'insurer': 'Britam Insurance',
                'description': 'Health Insurance Premium'
            },
            {
                'id': 3,
                'receipt_number': 'RCP-2024-003',
                'customer_name': 'David Ochieng',
                'policy_number': 'POL-2024-003',
                'amount': 35000,
                'payment_date': '2024-01-17',
                'payment_method': 'M-Pesa',
                'status': 'pending',
                'insurer': 'UAP Old Mutual',
                'description': 'Life Insurance Premium'
            }
        ]
        
        return jsonify({
            'success': True,
            'receipts': receipts
        })
        
    except Exception as e:
        print(f"Customer receipts fetch error: {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to fetch customer receipts'}), 500

@app.route('/api/customer-receipts/<int:receipt_id>/', methods=['GET'])
def get_customer_receipt(receipt_id):
    """Get a specific customer receipt by ID"""
    try:
        receipts = {
            1: {
                'id': 1,
                'receipt_number': 'RCP-2024-001',
                'customer_name': 'John Kamau',
                'policy_number': 'POL-2024-001',
                'amount': 25000,
                'payment_date': '2024-01-15',
                'payment_method': 'M-Pesa',
                'status': 'completed',
                'insurer': 'Jubilee Insurance',
                'description': 'Motor Insurance Premium'
            }
        }
        
        receipt = receipts.get(receipt_id)
        if not receipt:
            return jsonify({'success': False, 'message': 'Receipt not found'}), 404
        
        return jsonify({
            'success': True,
            'receipt': receipt
        })
        
    except Exception as e:
        print(f"Customer receipt fetch error: {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to fetch receipt'}), 500

# Premium API Endpoints
@app.route('/api/premiums/', methods=['GET'])
def get_premiums():
    """Get all premiums"""
    try:
        premiums = [
            {
                'id': 1,
                'policy_number': 'POL-2024-001',
                'customer_name': 'John Kamau',
                'premium_type': 'Annual',
                'total_amount': 25000,
                'paid_amount': 20000,
                'balance': 5000,
                'due_date': '2024-02-15',
                'status': 'partial',
                'insurer': 'Jubilee Insurance',
                'frequency': 'Monthly'
            },
            {
                'id': 2,
                'policy_number': 'POL-2024-002',
                'customer_name': 'Mary Wanjiku',
                'premium_type': 'Annual',
                'total_amount': 15000,
                'paid_amount': 15000,
                'balance': 0,
                'due_date': '2024-01-16',
                'status': 'paid',
                'insurer': 'Britam Insurance',
                'frequency': 'Annual'
            },
            {
                'id': 3,
                'policy_number': 'POL-2024-003',
                'customer_name': 'David Ochieng',
                'premium_type': 'Annual',
                'total_amount': 35000,
                'paid_amount': 0,
                'balance': 35000,
                'due_date': '2024-02-17',
                'status': 'unpaid',
                'insurer': 'UAP Old Mutual',
                'frequency': 'Quarterly'
            }
        ]
        
        return jsonify({
            'success': True,
            'premiums': premiums
        })
        
    except Exception as e:
        print(f"Premiums fetch error: {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to fetch premiums'}), 500

@app.route('/api/premiums/<int:premium_id>/', methods=['GET'])
def get_premium(premium_id):
    """Get a specific premium by ID"""
    try:
        premiums = {
            1: {
                'id': 1,
                'policy_number': 'POL-2024-001',
                'customer_name': 'John Kamau',
                'premium_type': 'Annual',
                'total_amount': 25000,
                'paid_amount': 20000,
                'balance': 5000,
                'due_date': '2024-02-15',
                'status': 'partial',
                'insurer': 'Jubilee Insurance',
                'frequency': 'Monthly'
            }
        }
        
        premium = premiums.get(premium_id)
        if not premium:
            return jsonify({'success': False, 'message': 'Premium not found'}), 404
        
        return jsonify({
            'success': True,
            'premium': premium
        })
        
    except Exception as e:
        print(f"Premium fetch error: {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to fetch premium'}), 500

# Premium Payment Logs API Endpoints
@app.route('/api/premium-payment-logs/', methods=['GET'])
def get_premium_payment_logs():
    """Get all premium payment logs"""
    try:
        payment_logs = [
            {
                'id': 1,
                'transaction_id': 'TRX-2024-001',
                'policy_number': 'POL-2024-001',
                'customer_name': 'John Kamau',
                'amount': 5000,
                'payment_date': '2024-01-15',
                'payment_method': 'M-Pesa',
                'payment_reference': 'MP123456789',
                'status': 'completed',
                'insurer': 'Jubilee Insurance',
                'processed_by': 'Agent John'
            },
            {
                'id': 2,
                'transaction_id': 'TRX-2024-002',
                'policy_number': 'POL-2024-002',
                'customer_name': 'Mary Wanjiku',
                'amount': 15000,
                'payment_date': '2024-01-16',
                'payment_method': 'Bank Transfer',
                'payment_reference': 'BANK987654321',
                'status': 'completed',
                'insurer': 'Britam Insurance',
                'processed_by': 'Agent Mary'
            },
            {
                'id': 3,
                'transaction_id': 'TRX-2024-003',
                'policy_number': 'POL-2024-003',
                'customer_name': 'David Ochieng',
                'amount': 8000,
                'payment_date': '2024-01-17',
                'payment_method': 'M-Pesa',
                'payment_reference': 'MP456789123',
                'status': 'pending',
                'insurer': 'UAP Old Mutual',
                'processed_by': 'Agent David'
            }
        ]
        
        return jsonify({
            'success': True,
            'payment_logs': payment_logs
        })
        
    except Exception as e:
        print(f"Premium payment logs fetch error: {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to fetch premium payment logs'}), 500

@app.route('/api/premium-payment-logs/<int:log_id>/', methods=['GET'])
def get_premium_payment_log(log_id):
    """Get a specific premium payment log by ID"""
    try:
        payment_logs = {
            1: {
                'id': 1,
                'transaction_id': 'TRX-2024-001',
                'policy_number': 'POL-2024-001',
                'customer_name': 'John Kamau',
                'amount': 5000,
                'payment_date': '2024-01-15',
                'payment_method': 'M-Pesa',
                'payment_reference': 'MP123456789',
                'status': 'completed',
                'insurer': 'Jubilee Insurance',
                'processed_by': 'Agent John'
            }
        }
        
        payment_log = payment_logs.get(log_id)
        if not payment_log:
            return jsonify({'success': False, 'message': 'Payment log not found'}), 404
        
        return jsonify({
            'success': True,
            'payment_log': payment_log
        })
        
    except Exception as e:
        print(f"Premium payment log fetch error: {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to fetch payment log'}), 500

# Insurer Payment API Endpoints
@app.route('/api/insurer-payments/', methods=['GET'])
def get_insurer_payments():
    """Get all insurer payments"""
    try:
        insurer_payments = [
            {
                'id': 1,
                'payment_id': 'INS-2024-001',
                'insurer_name': 'Jubilee Insurance',
                'policy_number': 'POL-2024-001',
                'amount': 25000,
                'payment_date': '2024-01-15',
                'payment_method': 'Bank Transfer',
                'status': 'completed',
                'reference_number': 'REF001',
                'description': 'Motor Insurance Premium Transfer'
            },
            {
                'id': 2,
                'payment_id': 'INS-2024-002',
                'insurer_name': 'Britam Insurance',
                'policy_number': 'POL-2024-002',
                'amount': 15000,
                'payment_date': '2024-01-16',
                'payment_method': 'Bank Transfer',
                'status': 'pending',
                'reference_number': 'REF002',
                'description': 'Health Insurance Premium Transfer'
            },
            {
                'id': 3,
                'payment_id': 'INS-2024-003',
                'insurer_name': 'UAP Old Mutual',
                'policy_number': 'POL-2024-003',
                'amount': 35000,
                'payment_date': '2024-01-17',
                'payment_method': 'Bank Transfer',
                'status': 'failed',
                'reference_number': 'REF003',
                'description': 'Life Insurance Premium Transfer'
            }
        ]
        
        return jsonify({
            'success': True,
            'insurer_payments': insurer_payments
        })
        
    except Exception as e:
        print(f"Insurer payments fetch error: {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to fetch insurer payments'}), 500

@app.route('/api/insurer-payments/<int:payment_id>/', methods=['GET'])
def get_insurer_payment(payment_id):
    """Get a specific insurer payment by ID"""
    try:
        insurer_payments = {
            1: {
                'id': 1,
                'payment_id': 'INS-2024-001',
                'insurer_name': 'Jubilee Insurance',
                'policy_number': 'POL-2024-001',
                'amount': 25000,
                'payment_date': '2024-01-15',
                'payment_method': 'Bank Transfer',
                'status': 'completed',
                'reference_number': 'REF001',
                'description': 'Motor Insurance Premium Transfer'
            }
        }
        
        insurer_payment = insurer_payments.get(payment_id)
        if not insurer_payment:
            return jsonify({'success': False, 'message': 'Insurer payment not found'}), 404
        
        return jsonify({
            'success': True,
            'insurer_payment': insurer_payment
        })
        
    except Exception as e:
        print(f"Insurer payment fetch error: {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to fetch insurer payment'}), 500

@app.route('/api/insurer-payments/<int:payment_id>/', methods=['PUT'])
def update_insurer_payment(payment_id):
    """Update insurer payment status and details"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['payment_id', 'insurer_name', 'policy_number', 'amount', 'status']
        for field in required_fields:
            if field not in data:
                return jsonify({'success': False, 'message': f'Missing field: {field}'}), 400
        
        # Simulate database update
        print(f"Updating insurer payment {payment_id} with data: {data}")
        
        return jsonify({
            'success': True,
            'message': 'Insurer payment updated successfully',
            'insurer_payment': {
                'id': payment_id,
                **data
            }
        })
        
    except Exception as e:
        print(f"Insurer payment update error: {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to update insurer payment'}), 500

@app.route('/api/payments/generate-link/', methods=['POST'])
def generate_payment_link():
    """Generate a payment link for customers"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['client', 'policy', 'company', 'product', 'customerDetails', 'policyDetails']
        for field in required_fields:
            if field not in data:
                return jsonify({'success': False, 'message': f'Missing required field: {field}'}), 400
        
        # Generate unique payment link ID and token
        import uuid
        import hashlib
        link_id = str(uuid.uuid4())
        token = str(uuid.uuid4()).replace('-', '')[:16]
        
        # Set expiry time
        from datetime import datetime, timedelta
        expiry_hours = data.get('expiryHours', 24)
        expiry_time = datetime.now() + timedelta(hours=expiry_hours)
        
        # Create secure hash for link validation
        hash_data = f"{token}:{expiry_time.timestamp()}:{data['product']['productName']}"
        secure_hash = hashlib.sha256(hash_data.encode()).hexdigest()
        
        # Create payment link URL
        payment_url = f"http://localhost:3000/payment/{token}?hash={secure_hash}"
        
        # Create payment link data
        payment_link = {
            'linkId': link_id,
            'token': token,
            'paymentUrl': payment_url,
            'client': data['client'],
            'policy': data['policy'],
            'company': data['company'],
            'product': data['product'],
            'customerDetails': data['customerDetails'],
            'policyDetails': data['policyDetails'],
            'expiryHours': expiry_hours,
            'createdAt': datetime.now().isoformat(),
            'expiresAt': expiry_time.isoformat(),
            'status': 'active',
            'singleUse': data.get('singleUse', False),
            'requirePhone': data.get('requirePhone', True)
        }
        
        # Store payment link (in production, this would be in a database)
        if not hasattr(generate_payment_link, 'payment_links'):
            generate_payment_link.payment_links = []
        generate_payment_link.payment_links.append(payment_link)
        
        return jsonify({
            'success': True,
            'paymentLink': payment_link
        })
        
    except Exception as e:
        print(f"Payment link generation error: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/generate-payment-link', methods=['POST'])
def generate_payment_link_old():
    """Generate a payment link for customers (legacy endpoint)"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['type', 'amount', 'customer_name', 'policy_number']
        for field in required_fields:
            if field not in data:
                return jsonify({'success': False, 'message': f'Missing required field: {field}'}), 400
        
        # Generate unique payment link ID
        import uuid
        link_id = str(uuid.uuid4())
        
        # Create payment link data
        payment_link = {
            'link_id': link_id,
            'type': data['type'],  # 'receipt', 'premium', etc.
            'amount': data['amount'],
            'customer_name': data['customer_name'],
            'policy_number': data['policy_number'],
            'description': data.get('description', ''),
            'expiry_hours': data.get('expiry_hours', 24),
            'created_at': datetime.now().isoformat(),
            'expires_at': (datetime.now() + timedelta(hours=data.get('expiry_hours', 24))).isoformat(),
            'status': 'active',
            'payment_url': f"https://pay.starzed.com/{link_id}"
        }
        
        # Store payment link (in production, this would be in a database)
        if not hasattr(generate_payment_link_old, 'payment_links'):
            generate_payment_link_old.payment_links = []
        generate_payment_link_old.payment_links.append(payment_link)
        
        return jsonify({
            'success': True,
            'payment_link': payment_link
        })
        
    except Exception as e:
        print(f"Payment link generation error: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/payment-links/<link_id>', methods=['GET'])
def get_payment_link(link_id):
    """Get payment link details"""
    try:
        if not hasattr(generate_payment_link, 'payment_links'):
            return jsonify({'success': False, 'message': 'Payment link not found'}), 404
            
        payment_link = next((link for link in generate_payment_link.payment_links if link['link_id'] == link_id), None)
        if not payment_link:
            return jsonify({'success': False, 'message': 'Payment link not found'}), 404
        
        # Check if link has expired
        if datetime.now() > datetime.fromisoformat(payment_link['expires_at']):
            payment_link['status'] = 'expired'
        
        return jsonify({
            'success': True,
            'payment_link': payment_link
        })
        
    except Exception as e:
        print(f"Payment link fetch error: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/mpesa/callback', methods=['POST'])
def mpesa_callback():
    """M-Pesa payment callback URL endpoint"""
    try:
        # Get the callback data from M-Pesa
        callback_data = request.get_json()
        
        if not callback_data:
            print("M-Pesa callback: No data received")
            return jsonify({'ResultCode': 1, 'ResultDesc': 'No data received'}), 400
        
        print(f"M-Pesa callback received: {callback_data}")
        
        # Extract M-Pesa callback data structure
        # M-Pesa typically sends data in this format:
        # {
        #   "Body": {
        #     "stkCallback": {
        #       "MerchantRequestID": "...",
        #       "CheckoutRequestID": "...",
        #       "ResultCode": 0,
        #       "ResultDesc": "The service request is processed successfully.",
        #       "CallbackMetadata": {
        #         "Item": [
        #           {"Name": "Amount", "Value": 1000},
        #           {"Name": "MpesaReceiptNumber", "Value": "LGR123ABC"},
        #           {"Name": "TransactionDate", "Value": "20240424120000"},
        #           {"Name": "PhoneNumber", "Value": "+254712345678"}
        #         ]
        #       }
        #     }
        #   }
        # }
        
        # Extract the STK callback data
        stk_callback = callback_data.get('Body', {}).get('stkCallback', {})
        
        if not stk_callback:
            print("M-Pesa callback: Invalid callback structure")
            return jsonify({'ResultCode': 1, 'ResultDesc': 'Invalid callback structure'}), 400
        
        # Extract key information
        merchant_request_id = stk_callback.get('MerchantRequestID')
        checkout_request_id = stk_callback.get('CheckoutRequestID')
        result_code = stk_callback.get('ResultCode')
        result_desc = stk_callback.get('ResultDesc')
        
        # Extract callback metadata
        callback_metadata = stk_callback.get('CallbackMetadata', {}).get('Item', [])
        
        # Parse metadata items into a dictionary
        metadata = {}
        for item in callback_metadata:
            if 'Name' in item and 'Value' in item:
                metadata[item['Name']] = item['Value']
        
        # Extract payment details
        amount = metadata.get('Amount')
        mpesa_receipt = metadata.get('MpesaReceiptNumber')
        transaction_date = metadata.get('TransactionDate')
        phone_number = metadata.get('PhoneNumber')
        
        # Log the payment details
        print(f"M-Pesa Payment Details:")
        print(f"  Result Code: {result_code}")
        print(f"  Result Desc: {result_desc}")
        print(f"  Merchant Request ID: {merchant_request_id}")
        print(f"  Checkout Request ID: {checkout_request_id}")
        print(f"  Amount: KES {amount}")
        print(f"  M-Pesa Receipt: {mpesa_receipt}")
        print(f"  Transaction Date: {transaction_date}")
        print(f"  Phone Number: {phone_number}")
        
        # Here you would typically:
        # 1. Update the payment status in your database
        # 2. Send confirmation to the customer
        # 3. Update the transaction records
        # 4. Trigger any business logic for successful payments
        
        if result_code == 0:  # Success
            print(f"Payment successful: KES {amount} from {phone_number}")
            # TODO: Update database with successful payment
            # TODO: Send payment confirmation
            # TODO: Update customer account
        else:
            print(f"Payment failed: {result_desc}")
            # TODO: Update database with failed payment
            # TODO: Handle payment failure logic
        
        # Return success response to M-Pesa
        response = {
            'ResultCode': 0,
            'ResultDesc': 'Callback received successfully'
        }
        
        return jsonify(response)
        
    except Exception as e:
        print(f"M-Pesa callback error: {str(e)}")
        return jsonify({
            'ResultCode': 1, 
            'ResultDesc': f'Error processing callback: {str(e)}'
        }), 500

@app.route('/api/mpesa/test-callback', methods=['POST'])
def test_mpesa_callback():
    """Test endpoint for M-Pesa callback simulation"""
    try:
        # Simulate a successful M-Pesa callback
        test_callback = {
            "Body": {
                "stkCallback": {
                    "MerchantRequestID": "test-merchant-" + str(int(time.time())),
                    "CheckoutRequestID": "test-checkout-" + str(int(time.time())),
                    "ResultCode": 0,
                    "ResultDesc": "The service request is processed successfully.",
                    "CallbackMetadata": {
                        "Item": [
                            {"Name": "Amount", "Value": 1500},
                            {"Name": "MpesaReceiptNumber", "Value": "LGR123TEST"},
                            {"Name": "TransactionDate", "Value": "20240424120000"},
                            {"Name": "PhoneNumber", "Value": "+254712345678"}
                        ]
                    }
                }
            }
        }
        
        print(f"Test M-Pesa callback: {test_callback}")
        
        return jsonify({
            'success': True,
            'message': 'Test callback processed successfully',
            'callback_data': test_callback
        })
        
    except Exception as e:
        print(f"Test M-Pesa callback error: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    print(f"Starting server on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=False)
