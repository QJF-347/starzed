from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import ExtraPremium
from .serializers import ExtraPremiumSerializer


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def extra_premium_list(request):
    if request.method == 'GET':
        premiums = ExtraPremium.objects.all()
        serializer = ExtraPremiumSerializer(premiums, many=True)
        return Response({'success': True, 'data': serializer.data})

    elif request.method == 'POST':
        serializer = ExtraPremiumSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([AllowAny])
def extra_premium_detail(request, id):
    try:
        premium = ExtraPremium.objects.get(id=id)
    except ExtraPremium.DoesNotExist:
        return Response({'success': False, 'message': 'Extra premium not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ExtraPremiumSerializer(premium)
        return Response({'success': True, 'data': serializer.data})

    elif request.method == 'PUT':
        serializer = ExtraPremiumSerializer(premium, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'data': serializer.data})
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        premium.delete()
        return Response({'success': True, 'message': 'Extra premium deleted'})


@api_view(['POST'])
@permission_classes([AllowAny])
def bulk_import_extra_premiums(request):
    data = request.data
    if isinstance(data, list):
        items = data
    elif isinstance(data, dict) and 'premiums' in data:
        items = data['premiums']
    else:
        items = [data]

    created = []
    errors = []
    for item in items:
        serializer = ExtraPremiumSerializer(data=item)
        if serializer.is_valid():
            serializer.save()
            created.append(serializer.data)
        else:
            errors.append({'input': item, 'errors': serializer.errors})

    return Response({
        'success': True,
        'created': len(created),
        'errors': len(errors),
        'data': created,
        'error_details': errors if errors else None
    })
