from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db import transaction

from .models import Report
from .serializers import ReportSerializer


@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def report_list(request):
    if request.method == 'GET':
        queryset = Report.objects.all().order_by('-created_at')
        serializer = ReportSerializer(queryset, many=True)
        return Response({'success': True, 'data': serializer.data})

    serializer = ReportSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {'success': True, 'message': 'Report created successfully', 'data': serializer.data},
            status=status.HTTP_201_CREATED,
        )
    return Response(
        {'success': False, 'message': 'Validation errors', 'errors': serializer.errors},
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([permissions.AllowAny])
def report_detail(request, id):
    try:
        obj = Report.objects.get(id=id)
    except Report.DoesNotExist:
        return Response({'success': False, 'message': 'Report not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ReportSerializer(obj)
        return Response({'success': True, 'data': serializer.data})

    if request.method in ['PUT', 'PATCH']:
        serializer = ReportSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'message': 'Report updated successfully', 'data': serializer.data})
        return Response(
            {'success': False, 'message': 'Validation errors', 'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    obj.delete()
    return Response({'success': True, 'message': 'Report deleted successfully'})


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def bulk_import_reports(request):
    data_list = request.data.get('reports', [])
    created = []
    updated = []
    failed = []

    with transaction.atomic():
        for row in data_list:
            report_no = (row.get('report_no') or row.get('reportNo') or '').strip()
            title = (row.get('title') or '').strip()
            if not report_no:
                failed.append({'data': row, 'error': 'Report number is required'})
                continue
            if not title:
                failed.append({'data': row, 'error': 'Report title is required'})
                continue

            defaults = {
                'title': title,
                'report_type': row.get('report_type') or row.get('reportType') or None,
                'description': row.get('description') or '',
                'status': row.get('status') or 'Draft',
            }
            try:
                obj, was_created = Report.objects.update_or_create(report_no=report_no, defaults=defaults)
                if was_created:
                    created.append({'id': str(obj.id), 'report_no': obj.report_no})
                else:
                    updated.append({'id': str(obj.id), 'report_no': obj.report_no})
            except Exception as e:
                failed.append({'data': row, 'error': str(e)})

    return Response({
        'success': True,
        'message': f'Import completed. Created: {len(created)}, Updated: {len(updated)}, Failed: {len(failed)}',
        'created': created,
        'updated': updated,
        'failed': failed,
    })
