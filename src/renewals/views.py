from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db import transaction

from .models import Renewal
from .serializers import RenewalSerializer


@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def renewal_list(request):
    if request.method == 'GET':
        queryset = Renewal.objects.all().order_by('-created_at')
        serializer = RenewalSerializer(queryset, many=True)
        return Response({'success': True, 'data': serializer.data})

    serializer = RenewalSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {'success': True, 'message': 'Renewal created successfully', 'data': serializer.data},
            status=status.HTTP_201_CREATED,
        )
    return Response(
        {'success': False, 'message': 'Validation errors', 'errors': serializer.errors},
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([permissions.AllowAny])
def renewal_detail(request, id):
    try:
        obj = Renewal.objects.get(id=id)
    except Renewal.DoesNotExist:
        return Response({'success': False, 'message': 'Renewal not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = RenewalSerializer(obj)
        return Response({'success': True, 'data': serializer.data})

    if request.method in ['PUT', 'PATCH']:
        serializer = RenewalSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'message': 'Renewal updated successfully', 'data': serializer.data})
        return Response(
            {'success': False, 'message': 'Validation errors', 'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    obj.delete()
    return Response({'success': True, 'message': 'Renewal deleted successfully'})


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def bulk_import_renewals(request):
    data_list = request.data.get('renewals', [])
    created = []
    updated = []
    failed = []

    with transaction.atomic():
        for row in data_list:
            renewal_no = (row.get('renewal_no') or row.get('renewalNo') or '').strip()
            client_name = (row.get('client_name') or row.get('clientName') or '').strip()
            if not renewal_no:
                failed.append({'data': row, 'error': 'Renewal number is required'})
                continue
            if not client_name:
                failed.append({'data': row, 'error': 'Client name is required'})
                continue

            defaults = {
                'client_name': client_name,
                'policy_number': row.get('policy_number') or row.get('policyNo') or None,
                'product': row.get('product') or None,
                'insurer': row.get('insurer') or None,
                'premium': row.get('premium') or 0,
                'status': row.get('status') or 'Pending',
            }
            try:
                obj, was_created = Renewal.objects.update_or_create(renewal_no=renewal_no, defaults=defaults)
                if was_created:
                    created.append({'id': str(obj.id), 'renewal_no': obj.renewal_no})
                else:
                    updated.append({'id': str(obj.id), 'renewal_no': obj.renewal_no})
            except Exception as e:
                failed.append({'data': row, 'error': str(e)})

    return Response({
        'success': True,
        'message': f'Import completed. Created: {len(created)}, Updated: {len(updated)}, Failed: {len(failed)}',
        'created': created,
        'updated': updated,
        'failed': failed,
    })
