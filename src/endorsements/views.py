from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db import transaction

from .models import Endorsement
from .serializers import EndorsementSerializer


@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def endorsement_list(request):
    if request.method == 'GET':
        queryset = Endorsement.objects.all().order_by('-created_at')
        serializer = EndorsementSerializer(queryset, many=True)
        return Response({'success': True, 'data': serializer.data})

    serializer = EndorsementSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {'success': True, 'message': 'Endorsement created successfully', 'data': serializer.data},
            status=status.HTTP_201_CREATED,
        )
    return Response(
        {'success': False, 'message': 'Validation errors', 'errors': serializer.errors},
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([permissions.AllowAny])
def endorsement_detail(request, id):
    try:
        obj = Endorsement.objects.get(id=id)
    except Endorsement.DoesNotExist:
        return Response({'success': False, 'message': 'Endorsement not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = EndorsementSerializer(obj)
        return Response({'success': True, 'data': serializer.data})

    if request.method in ['PUT', 'PATCH']:
        serializer = EndorsementSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'message': 'Endorsement updated successfully', 'data': serializer.data})
        return Response(
            {'success': False, 'message': 'Validation errors', 'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    obj.delete()
    return Response({'success': True, 'message': 'Endorsement deleted successfully'})


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def bulk_import_endorsements(request):
    data_list = request.data.get('endorsements', [])
    created = []
    updated = []
    failed = []

    with transaction.atomic():
        for row in data_list:
            policy_number = (row.get('policy_number') or row.get('policyNo') or '').strip()
            client_name = (row.get('client_name') or row.get('clientName') or '').strip()
            if not policy_number:
                failed.append({'data': row, 'error': 'Policy number is required'})
                continue
            if not client_name:
                failed.append({'data': row, 'error': 'Client name is required'})
                continue

            defaults = {
                'client_name': client_name,
                'product': row.get('product') or None,
                'insurer': row.get('insurer') or None,
                'endorsement_type': row.get('endorsement_type') or row.get('endorsementType') or None,
                'description': row.get('description') or '',
                'amount': row.get('amount') or 0,
                'status': row.get('status') or 'Pending',
            }
            try:
                obj, was_created = Endorsement.objects.update_or_create(
                    policy_number=policy_number, client_name=client_name, defaults=defaults
                )
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
