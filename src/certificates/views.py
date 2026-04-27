from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db import transaction

from .models import Certificate, CertificateIssue, CertificateDeclaration
from .serializers import (
    CertificateSerializer,
    CertificateIssueSerializer,
    CertificateDeclarationSerializer,
)


@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def certificate_list(request):
    if request.method == 'GET':
        queryset = Certificate.objects.all().order_by('-created_at')
        serializer = CertificateSerializer(queryset, many=True)
        return Response({'success': True, 'data': serializer.data})

    serializer = CertificateSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {'success': True, 'message': 'Certificate created successfully', 'data': serializer.data},
            status=status.HTTP_201_CREATED,
        )
    return Response(
        {'success': False, 'message': 'Validation errors', 'errors': serializer.errors},
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([permissions.AllowAny])
def certificate_detail(request, id):
    try:
        obj = Certificate.objects.get(id=id)
    except Certificate.DoesNotExist:
        return Response({'success': False, 'message': 'Certificate not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CertificateSerializer(obj)
        return Response({'success': True, 'data': serializer.data})

    if request.method in ['PUT', 'PATCH']:
        serializer = CertificateSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'message': 'Certificate updated successfully', 'data': serializer.data})
        return Response(
            {'success': False, 'message': 'Validation errors', 'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    obj.delete()
    return Response({'success': True, 'message': 'Certificate deleted successfully'})


@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def certificate_issue_list(request):
    if request.method == 'GET':
        queryset = CertificateIssue.objects.all().order_by('-created_at')
        serializer = CertificateIssueSerializer(queryset, many=True)
        return Response({'success': True, 'data': serializer.data})

    serializer = CertificateIssueSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {'success': True, 'message': 'Certificate issue created successfully', 'data': serializer.data},
            status=status.HTTP_201_CREATED,
        )
    return Response(
        {'success': False, 'message': 'Validation errors', 'errors': serializer.errors},
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([permissions.AllowAny])
def certificate_issue_detail(request, id):
    try:
        obj = CertificateIssue.objects.get(id=id)
    except CertificateIssue.DoesNotExist:
        return Response({'success': False, 'message': 'Certificate issue not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CertificateIssueSerializer(obj)
        return Response({'success': True, 'data': serializer.data})

    if request.method in ['PUT', 'PATCH']:
        serializer = CertificateIssueSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'message': 'Certificate issue updated successfully', 'data': serializer.data})
        return Response(
            {'success': False, 'message': 'Validation errors', 'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    obj.delete()
    return Response({'success': True, 'message': 'Certificate issue deleted successfully'})


@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def certificate_declaration_list(request):
    if request.method == 'GET':
        queryset = CertificateDeclaration.objects.all().order_by('-created_at')
        serializer = CertificateDeclarationSerializer(queryset, many=True)
        return Response({'success': True, 'data': serializer.data})

    serializer = CertificateDeclarationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {'success': True, 'message': 'Certificate declaration created successfully', 'data': serializer.data},
            status=status.HTTP_201_CREATED,
        )
    return Response(
        {'success': False, 'message': 'Validation errors', 'errors': serializer.errors},
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([permissions.AllowAny])
def certificate_declaration_detail(request, id):
    try:
        obj = CertificateDeclaration.objects.get(id=id)
    except CertificateDeclaration.DoesNotExist:
        return Response({'success': False, 'message': 'Certificate declaration not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CertificateDeclarationSerializer(obj)
        return Response({'success': True, 'data': serializer.data})

    if request.method in ['PUT', 'PATCH']:
        serializer = CertificateDeclarationSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'message': 'Certificate declaration updated successfully', 'data': serializer.data})
        return Response(
            {'success': False, 'message': 'Validation errors', 'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    obj.delete()
    return Response({'success': True, 'message': 'Certificate declaration deleted successfully'})


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def bulk_import_certificates(request):
    data_list = request.data.get('certificates', [])
    created = []
    updated = []
    failed = []

    with transaction.atomic():
        for row in data_list:
            cert_no = (row.get('certificate_no') or row.get('certificateNo') or '').strip()
            client_name = (row.get('client_name') or row.get('clientName') or '').strip()
            if not cert_no:
                failed.append({'data': row, 'error': 'Certificate number is required'})
                continue
            if not client_name:
                failed.append({'data': row, 'error': 'Client name is required'})
                continue

            defaults = {
                'user_name': client_name,
                'insurer': row.get('insurer') or None,
                'amount': row.get('amount') or 0,
                'status': row.get('status') or 'Active',
                'item': row.get('item') or None,
                'd_expiry': row.get('d_expiry') or row.get('expiry_date') or None,
                'date': row.get('date') or row.get('issue_date') or None,
            }
            try:
                obj, was_created = Certificate.objects.update_or_create(certificate_no=cert_no, defaults=defaults)
                if was_created:
                    created.append({'id': str(obj.id), 'certificate_no': obj.certificate_no})
                else:
                    updated.append({'id': str(obj.id), 'certificate_no': obj.certificate_no})
            except Exception as e:
                failed.append({'data': row, 'error': str(e)})

    return Response({
        'success': True,
        'message': f'Import completed. Created: {len(created)}, Updated: {len(updated)}, Failed: {len(failed)}',
        'created': created,
        'updated': updated,
        'failed': failed,
    })
