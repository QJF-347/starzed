from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import InsuranceType
from .serializers import InsuranceTypeSerializer


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def insurance_type_list(request):
    if request.method == 'GET':
        types = InsuranceType.objects.all().order_by('type')
        serializer = InsuranceTypeSerializer(types, many=True)
        return Response({'success': True, 'data': serializer.data})

    serializer = InsuranceTypeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {'success': True, 'message': 'Insurance type created successfully', 'data': serializer.data},
            status=status.HTTP_201_CREATED,
        )

    return Response(
        {'success': False, 'message': 'Validation errors', 'errors': serializer.errors},
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([AllowAny])
def insurance_type_detail(request, id):
    try:
        insurance_type = InsuranceType.objects.get(id=id)
    except InsuranceType.DoesNotExist:
        return Response({'success': False, 'message': 'Insurance type not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = InsuranceTypeSerializer(insurance_type)
        return Response({'success': True, 'data': serializer.data})

    if request.method in ['PUT', 'PATCH']:
        serializer = InsuranceTypeSerializer(insurance_type, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'message': 'Insurance type updated successfully', 'data': serializer.data})
        return Response(
            {'success': False, 'message': 'Validation errors', 'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    insurance_type.delete()
    return Response({'success': True, 'message': 'Insurance type deleted successfully'})


@api_view(['POST'])
@permission_classes([AllowAny])
def bulk_import_insurance_types(request):
    types_data = request.data.get('types', [])

    created = []
    updated = []
    failed = []

    for row in types_data:
        raw_type = (row.get('type') or '').strip()
        if not raw_type:
            failed.append({'data': row, 'error': 'Type is required'})
            continue

        defaults = {
            'description': (row.get('description') or '').strip(),
            'status': row.get('status') or 'Active',
        }

        try:
            obj, was_created = InsuranceType.objects.update_or_create(type=raw_type, defaults=defaults)
            if was_created:
                created.append({'id': str(obj.id), 'type': obj.type})
            else:
                updated.append({'id': str(obj.id), 'type': obj.type})
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
