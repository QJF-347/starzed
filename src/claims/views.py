from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db import transaction

from .models import Claim
from .serializers import ClaimSerializer


@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def claim_list(request):
    if request.method == 'GET':
        claims = Claim.objects.all().order_by('-created_at')
        serializer = ClaimSerializer(claims, many=True)
        return Response({'success': True, 'data': serializer.data})

    serializer = ClaimSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {'success': True, 'message': 'Claim created successfully', 'data': serializer.data},
            status=status.HTTP_201_CREATED,
        )

    return Response(
        {'success': False, 'message': 'Validation errors', 'errors': serializer.errors},
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([permissions.AllowAny])
def claim_detail(request, id):
    try:
        claim = Claim.objects.get(id=id)
    except Claim.DoesNotExist:
        return Response({'success': False, 'message': 'Claim not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ClaimSerializer(claim)
        return Response({'success': True, 'data': serializer.data})

    if request.method in ['PUT', 'PATCH']:
        serializer = ClaimSerializer(claim, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'message': 'Claim updated successfully', 'data': serializer.data})
        return Response(
            {'success': False, 'message': 'Validation errors', 'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    claim.delete()
    return Response({'success': True, 'message': 'Claim deleted successfully'})


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def bulk_import_claims(request):
    claims_data = request.data.get('claims', [])

    created = []
    updated = []
    failed = []

    with transaction.atomic():
        for row in claims_data:
            claim_number = (row.get('claim_number') or row.get('claimNo') or '').strip()
            client_name = (row.get('client_name') or row.get('clientName') or '').strip()

            if not claim_number:
                failed.append({'data': row, 'error': 'Claim number is required'})
                continue
            if not client_name:
                failed.append({'data': row, 'error': 'Client name is required'})
                continue

            defaults = {
                'client_name': client_name,
                'policy_number': (row.get('policy_number') or row.get('policyNo') or '').strip() or None,
                'insurance_class': (row.get('insurance_class') or row.get('class') or '').strip() or None,
                'claim_type': (row.get('claim_type') or row.get('claimType') or '').strip() or None,
                'status': (row.get('status') or 'Pending'),
                'amount': row.get('amount') or 0,
                'paid': row.get('paid') or 0,
                'balance': row.get('balance') or 0,
                'item': (row.get('item') or '').strip() or None,
            }

            # Date parsing: accept YYYY-MM-DD
            date_val = row.get('date')
            if isinstance(date_val, str) and date_val.strip():
                defaults['date'] = date_val.strip()
            elif date_val:
                defaults['date'] = date_val

            try:
                obj, was_created = Claim.objects.update_or_create(claim_number=claim_number, defaults=defaults)
                if was_created:
                    created.append({'id': str(obj.id), 'claim_number': obj.claim_number})
                else:
                    updated.append({'id': str(obj.id), 'claim_number': obj.claim_number})
            except Exception as e:
                failed.append({'data': row, 'error': str(e)})

    return Response(
        {
            'success': True,
            'message': f'Import completed. Created: {len(created)}, Updated: {len(updated)}, Failed: {len(failed)}',
            'created': created,
            'updated': updated,
            'failed': failed,
        }
    )
