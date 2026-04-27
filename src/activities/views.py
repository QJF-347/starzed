from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db import transaction

from .models import Activity
from .serializers import ActivitySerializer


@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def activity_list(request):
    if request.method == 'GET':
        queryset = Activity.objects.all().order_by('-created_at')
        serializer = ActivitySerializer(queryset, many=True)
        return Response({'success': True, 'data': serializer.data})

    serializer = ActivitySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {'success': True, 'message': 'Activity created successfully', 'data': serializer.data},
            status=status.HTTP_201_CREATED,
        )
    return Response(
        {'success': False, 'message': 'Validation errors', 'errors': serializer.errors},
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([permissions.AllowAny])
def activity_detail(request, id):
    try:
        obj = Activity.objects.get(id=id)
    except Activity.DoesNotExist:
        return Response({'success': False, 'message': 'Activity not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ActivitySerializer(obj)
        return Response({'success': True, 'data': serializer.data})

    if request.method in ['PUT', 'PATCH']:
        serializer = ActivitySerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'message': 'Activity updated successfully', 'data': serializer.data})
        return Response(
            {'success': False, 'message': 'Validation errors', 'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    obj.delete()
    return Response({'success': True, 'message': 'Activity deleted successfully'})


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def bulk_import_activities(request):
    data_list = request.data.get('activities', [])
    created = []
    updated = []
    failed = []

    with transaction.atomic():
        for row in data_list:
            activity_no = (row.get('activity_no') or row.get('activityNo') or '').strip()
            activity_type = (row.get('activity_type') or row.get('activityType') or '').strip()
            if not activity_no:
                failed.append({'data': row, 'error': 'Activity number is required'})
                continue
            if not activity_type:
                failed.append({'data': row, 'error': 'Activity type is required'})
                continue

            defaults = {
                'activity_type': activity_type,
                'description': row.get('description') or '',
                'client_name': row.get('client_name') or row.get('clientName') or '',
                'policy_number': row.get('policy_number') or row.get('policyNo') or None,
                'status': row.get('status') or 'Pending',
            }
            try:
                obj, was_created = Activity.objects.update_or_create(activity_no=activity_no, defaults=defaults)
                if was_created:
                    created.append({'id': str(obj.id), 'activity_no': obj.activity_no})
                else:
                    updated.append({'id': str(obj.id), 'activity_no': obj.activity_no})
            except Exception as e:
                failed.append({'data': row, 'error': str(e)})

    return Response({
        'success': True,
        'message': f'Import completed. Created: {len(created)}, Updated: {len(updated)}, Failed: {len(failed)}',
        'created': created,
        'updated': updated,
        'failed': failed,
    })
