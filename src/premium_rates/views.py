from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db import transaction

from .models import InsurerPremiumRate
from .serializers import InsurerPremiumRateSerializer


@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def premium_rate_list(request):
    if request.method == 'GET':
        queryset = InsurerPremiumRate.objects.all().order_by('-created_at')
        serializer = InsurerPremiumRateSerializer(queryset, many=True)
        return Response({'success': True, 'data': serializer.data})

    serializer = InsurerPremiumRateSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {'success': True, 'message': 'Premium rate created successfully', 'data': serializer.data},
            status=status.HTTP_201_CREATED,
        )
    return Response(
        {'success': False, 'message': 'Validation errors', 'errors': serializer.errors},
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([permissions.AllowAny])
def premium_rate_detail(request, id):
    try:
        obj = InsurerPremiumRate.objects.get(id=id)
    except InsurerPremiumRate.DoesNotExist:
        return Response({'success': False, 'message': 'Premium rate not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = InsurerPremiumRateSerializer(obj)
        return Response({'success': True, 'data': serializer.data})

    if request.method in ['PUT', 'PATCH']:
        serializer = InsurerPremiumRateSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'message': 'Premium rate updated successfully', 'data': serializer.data})
        return Response(
            {'success': False, 'message': 'Validation errors', 'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    obj.delete()
    return Response({'success': True, 'message': 'Premium rate deleted successfully'})


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def bulk_import_premium_rates(request):
    data_list = request.data.get('premium_rates', [])
    created = []
    updated = []
    failed = []

    with transaction.atomic():
        for row in data_list:
            insurer_name = (row.get('insurer_name') or row.get('insurerName') or '').strip()
            category = (row.get('category') or '').strip()
            if not insurer_name:
                failed.append({'data': row, 'error': 'Insurer name is required'})
                continue
            if not category:
                failed.append({'data': row, 'error': 'Category is required'})
                continue

            defaults = {
                'rate': row.get('rate') or 0,
                'description': row.get('description') or '',
                'status': row.get('status') or 'Active',
            }
            try:
                obj, was_created = InsurerPremiumRate.objects.update_or_create(
                    insurer_name=insurer_name, category=category, defaults=defaults
                )
                if was_created:
                    created.append({'id': str(obj.id), 'insurer_name': obj.insurer_name, 'category': obj.category})
                else:
                    updated.append({'id': str(obj.id), 'insurer_name': obj.insurer_name, 'category': obj.category})
            except Exception as e:
                failed.append({'data': row, 'error': str(e)})

    return Response({
        'success': True,
        'message': f'Import completed. Created: {len(created)}, Updated: {len(updated)}, Failed: {len(failed)}',
        'created': created,
        'updated': updated,
        'failed': failed,
    })
