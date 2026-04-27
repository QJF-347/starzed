from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db import transaction

from .models import Transaction, TransactionExtraPremium
from .serializers import TransactionSerializer, TransactionExtraPremiumSerializer


@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def transaction_list(request):
    if request.method == 'GET':
        queryset = Transaction.objects.all().order_by('-created_at')
        serializer = TransactionSerializer(queryset, many=True)
        return Response({'success': True, 'data': serializer.data})

    serializer = TransactionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {'success': True, 'message': 'Transaction created successfully', 'data': serializer.data},
            status=status.HTTP_201_CREATED,
        )
    return Response(
        {'success': False, 'message': 'Validation errors', 'errors': serializer.errors},
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([permissions.AllowAny])
def transaction_detail(request, id):
    try:
        obj = Transaction.objects.get(id=id)
    except Transaction.DoesNotExist:
        return Response({'success': False, 'message': 'Transaction not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = TransactionSerializer(obj)
        return Response({'success': True, 'data': serializer.data})

    if request.method in ['PUT', 'PATCH']:
        serializer = TransactionSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'message': 'Transaction updated successfully', 'data': serializer.data})
        return Response(
            {'success': False, 'message': 'Validation errors', 'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    obj.delete()
    return Response({'success': True, 'message': 'Transaction deleted successfully'})


@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def extra_premium_list(request):
    if request.method == 'GET':
        queryset = TransactionExtraPremium.objects.all().order_by('-created_at')
        serializer = TransactionExtraPremiumSerializer(queryset, many=True)
        return Response({'success': True, 'data': serializer.data})

    serializer = TransactionExtraPremiumSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {'success': True, 'message': 'Extra premium created successfully', 'data': serializer.data},
            status=status.HTTP_201_CREATED,
        )
    return Response(
        {'success': False, 'message': 'Validation errors', 'errors': serializer.errors},
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([permissions.AllowAny])
def extra_premium_detail(request, id):
    try:
        obj = TransactionExtraPremium.objects.get(id=id)
    except TransactionExtraPremium.DoesNotExist:
        return Response({'success': False, 'message': 'Extra premium not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = TransactionExtraPremiumSerializer(obj)
        return Response({'success': True, 'data': serializer.data})

    if request.method in ['PUT', 'PATCH']:
        serializer = TransactionExtraPremiumSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'message': 'Extra premium updated successfully', 'data': serializer.data})
        return Response(
            {'success': False, 'message': 'Validation errors', 'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    obj.delete()
    return Response({'success': True, 'message': 'Extra premium deleted successfully'})


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def bulk_import_transactions(request):
    data_list = request.data.get('transactions', [])
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
                'category': row.get('category') or 'motor',
                'product': row.get('product') or None,
                'insurer': row.get('insurer') or None,
                'transaction_type': row.get('transaction_type') or row.get('transactionType') or None,
                'amount': row.get('amount') or 0,
                'status': row.get('status') or 'Pending',
            }
            try:
                obj, was_created = Transaction.objects.update_or_create(
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
