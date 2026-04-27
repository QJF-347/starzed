from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Client, ClientPolicy, ClientDocument
from .serializers import ClientSerializer, ClientPolicySerializer, ClientDocumentSerializer
from django.db import transaction, models
from datetime import date, timedelta

@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def client_list(request):
    if request.method == 'GET':
        clients = Client.objects.all().order_by('-created_at')
        # For now, show all clients since we're allowing unauthenticated access
        # TODO: Add proper authentication and role-based filtering
        serializer = ClientSerializer(clients, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })
    elif request.method == 'POST':
        serializer = ClientSerializer(data=request.data)
        if serializer.is_valid():
            # For now, create client without agent since we're allowing unauthenticated access
            # TODO: Add proper authentication and role-based filtering
            serializer.save()
            return Response({
                'success': True,
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'success': False,
            'message': 'Validation errors',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.AllowAny])
def client_detail(request, id):
    try:
        client = Client.objects.get(id=id)
        # For now, allow access to all clients since we're allowing unauthenticated access
        # TODO: Add proper authentication and role-based filtering
            
        if request.method == 'GET':
            serializer = ClientSerializer(client)
            return Response({
                'success': True,
                'data': serializer.data
            })
        elif request.method == 'PUT':
            serializer = ClientSerializer(client, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'success': True,
                    'message': 'Client updated successfully',
                    'data': serializer.data
                })
            return Response({
                'success': False,
                'message': 'Validation errors',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        elif request.method == 'DELETE':
            client.delete()
            return Response({
                'success': True,
                'message': 'Client deleted successfully'
            })
    except Client.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Client not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def client_documents_list(request, client_id):
    try:
        client = Client.objects.get(id=client_id)
        documents = ClientDocument.objects.filter(client=client).order_by('-uploaded_at')
        serializer = ClientDocumentSerializer(documents, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })
    except Client.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Client not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'message': 'Error fetching client documents',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def client_policy_list(request, client_id):
    try:
        client = Client.objects.get(id=client_id)
        # For now, allow access to all client policies since we're allowing unauthenticated access
        # TODO: Add proper authentication and role-based filtering
            
        if request.method == 'GET':
            policies = client.policies.all().order_by('-created_at')
            serializer = ClientPolicySerializer(policies, many=True)
            return Response({
                'success': True,
                'data': serializer.data
            })
        elif request.method == 'POST':
            serializer = ClientPolicySerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(client=client)
                return Response({
                    'success': True,
                    'message': 'Policy created successfully',
                    'data': serializer.data
                }, status=status.HTTP_201_CREATED)
            return Response({
                'success': False,
                'message': 'Validation errors',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
    except Client.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Client not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def bulk_import(request):
    """
    Bulk import clients from Excel/CSV data
    """
    try:
        clients_data = request.data.get('clients', [])
        
        # Debug: Log what data we received
        print(f"=== Backend Bulk Import Debug ===")
        print(f"Received {len(clients_data)} clients")
        if clients_data:
            print(f"First client data: {clients_data[0]}")
            print(f"Available fields in first client: {list(clients_data[0].keys())}")
        
        if not clients_data:
            return Response({
                'success': False,
                'message': 'No client data provided'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        created_clients = []
        failed_clients = []
        
        for i, client_data in enumerate(clients_data):
            try:
                # Debug: Log processing of each client
                if i < 5:  # Only log first 5 to avoid spam
                    print(f"Processing client {i+1}: {client_data}")
                
                # Clean and validate the data
                client_name = client_data.get('clientName', '').strip()
                if not client_name:
                    failed_clients.append({
                        'data': client_data,
                        'error': 'Client name is required'
                    })
                    if i < 5:
                        print(f"  Failed: No client name found")
                    continue
                
                email = client_data.get('email', '').strip()
                
                # Only check for duplicate emails if email is provided
                if email and Client.objects.filter(email__iexact=email).exists():
                    # Instead of failing, clear the email to allow import
                    print(f"  Duplicate email found: {email}, clearing email to allow import")
                    email = None
                
                # Create client
                try:
                    client = Client.objects.create(
                        client_name=client_name,
                        business_name=client_data.get('businessName', 'Individual').strip(),
                        id_number=client_data.get('idNumber', '').strip() or None,
                        mobile=client_data.get('mobile', '').strip() or None,
                        kra_pin=client_data.get('kraPin', '').strip() or None,
                        email=email or None,
                        town=client_data.get('town', '').strip() or None,
                        address=client_data.get('address', '').strip() or None,
                        date_of_birth=client_data.get('dateOfBirth', '').strip() or None,
                        # Agent will be set later based on authentication
                        agent=None
                    )
                    
                    if i < 5:
                        print(f"  Successfully created client: {client.client_name}")
                    
                    created_clients.append({
                        'client_name': client.client_name,
                        'email': client.email,
                        'id': str(client.id)
                    })
                    
                except Exception as db_error:
                    print(f"  Database error creating client: {db_error}")
                    failed_clients.append({
                        'data': client_data,
                        'error': f'Database error: {str(db_error)}'
                    })
                
            except Exception as e:
                print(f"  General error processing client: {e}")
                failed_clients.append({
                    'data': client_data,
                    'error': str(e)
                })
        
        return Response({
            'success': True,
            'message': f'Import completed. Created: {len(created_clients)}, Failed: {len(failed_clients)}',
            'created_clients': created_clients,
            'failed_clients': failed_clients
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'message': f'Import failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def client_search(request):
    """
    Search clients by name, email, phone, or ID number
    """
    q = request.GET.get('q', '').strip()
    if not q:
        return Response({
            'success': True,
            'clients': []
        })

    clients = Client.objects.filter(
        models.Q(client_name__icontains=q) |
        models.Q(email__icontains=q) |
        models.Q(mobile__icontains=q) |
        models.Q(id_number__icontains=q)
    ).order_by('client_name')[:20]

    serializer = ClientSerializer(clients, many=True)
    return Response({
        'success': True,
        'clients': serializer.data
    })

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def policy_list(request):
    policies = ClientPolicy.objects.select_related('client', 'product', 'agent').all().order_by('-created_at')
    serializer = ClientPolicySerializer(policies, many=True)
    return Response({'success': True, 'data': serializer.data})


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def bulk_import_policies(request):
    policies_data = request.data.get('policies', [])
    created = []
    updated = []
    failed = []

    for row in policies_data:
        policy_number = (row.get('policy_number') or row.get('policyNo') or '').strip()
        if not policy_number:
            failed.append({'data': row, 'error': 'policy_number is required'})
            continue

        client_name = (row.get('client_name') or row.get('clientName') or '').strip()
        client_mobile = (row.get('client_mobile') or row.get('contact') or row.get('clientMobile') or '').strip()
        client_obj = None
        try:
            if client_name:
                client_obj, _created_client = Client.objects.get_or_create(
                    client_name=client_name,
                    defaults={
                        'mobile': client_mobile or None,
                        'business_name': 'Individual',
                    },
                )
                if client_mobile and not client_obj.mobile:
                    client_obj.mobile = client_mobile
                    client_obj.save(update_fields=['mobile'])
        except Exception:
            client_obj = None

        premium_amount = row.get('premium_amount') or row.get('premium') or 0
        premium_balance = row.get('premium_balance') or row.get('balance') or 0

        defaults = {
            'policy_type': (row.get('policy_type') or row.get('class') or row.get('policyType') or '').strip() or 'General',
            'cover_type': (row.get('cover_type') or row.get('cover') or row.get('coverType') or '').strip() or None,
            'premium_amount': premium_amount,
            'premium_balance': premium_balance,
            'status': (row.get('status') or 'active'),
        }

        start_date = row.get('start_date') or row.get('startDate') or row.get('date')
        expiry_date = row.get('expiry_date') or row.get('expiryDate')

        if not start_date:
            start_date = date.today().isoformat()
        if not expiry_date:
            expiry_date = (date.today() + timedelta(days=365)).isoformat()

        defaults['start_date'] = start_date
        defaults['expiry_date'] = expiry_date

        try:
            obj, was_created = ClientPolicy.objects.update_or_create(policy_number=policy_number, defaults=defaults)
            if client_obj:
                if obj.client_id != client_obj.id:
                    obj.client = client_obj
                    obj.save(update_fields=['client'])
            if was_created:
                created.append({'id': str(obj.id), 'policy_number': obj.policy_number})
            else:
                updated.append({'id': str(obj.id), 'policy_number': obj.policy_number})
        except Exception as e:
            failed.append({'data': row, 'error': str(e)})

    return Response({
        'success': True,
        'message': f'Import completed. Created: {len(created)}, Updated: {len(updated)}, Failed: {len(failed)}',
        'created': created,
        'updated': updated,
        'failed': failed,
    })
