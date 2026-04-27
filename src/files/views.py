from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db import transaction

from .models import AgentFile
from .serializers import AgentFileSerializer


@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def file_list(request):
    if request.method == 'GET':
        queryset = AgentFile.objects.all().order_by('-created_at')
        serializer = AgentFileSerializer(queryset, many=True)
        return Response({'success': True, 'data': serializer.data})

    serializer = AgentFileSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {'success': True, 'message': 'File created successfully', 'data': serializer.data},
            status=status.HTTP_201_CREATED,
        )
    return Response(
        {'success': False, 'message': 'Validation errors', 'errors': serializer.errors},
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([permissions.AllowAny])
def file_detail(request, id):
    try:
        obj = AgentFile.objects.get(id=id)
    except AgentFile.DoesNotExist:
        return Response({'success': False, 'message': 'File not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = AgentFileSerializer(obj)
        return Response({'success': True, 'data': serializer.data})

    if request.method in ['PUT', 'PATCH']:
        serializer = AgentFileSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'message': 'File updated successfully', 'data': serializer.data})
        return Response(
            {'success': False, 'message': 'Validation errors', 'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    obj.delete()
    return Response({'success': True, 'message': 'File deleted successfully'})


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def bulk_import_files(request):
    data_list = request.data.get('files', [])
    created = []
    updated = []
    failed = []

    with transaction.atomic():
        for row in data_list:
            file_no = (row.get('file_no') or row.get('fileNo') or '').strip()
            file_name = (row.get('file_name') or row.get('fileName') or '').strip()
            if not file_no:
                failed.append({'data': row, 'error': 'File number is required'})
                continue
            if not file_name:
                failed.append({'data': row, 'error': 'File name is required'})
                continue

            defaults = {
                'file_name': file_name,
                'file_type': row.get('file_type') or row.get('fileType') or None,
                'description': row.get('description') or '',
                'client_name': row.get('client_name') or row.get('clientName') or '',
                'policy_number': row.get('policy_number') or row.get('policyNo') or None,
                'status': row.get('status') or 'Active',
            }
            try:
                obj, was_created = AgentFile.objects.update_or_create(file_no=file_no, defaults=defaults)
                if was_created:
                    created.append({'id': str(obj.id), 'file_no': obj.file_no})
                else:
                    updated.append({'id': str(obj.id), 'file_no': obj.file_no})
            except Exception as e:
                failed.append({'data': row, 'error': str(e)})

    return Response({
        'success': True,
        'message': f'Import completed. Created: {len(created)}, Updated: {len(updated)}, Failed: {len(failed)}',
        'created': created,
        'updated': updated,
        'failed': failed,
    })
