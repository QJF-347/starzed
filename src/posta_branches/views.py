from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import PostaBranch
from .serializers import PostaBranchSerializer


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def branch_list(request):
    if request.method == 'GET':
        branches = PostaBranch.objects.all()
        serializer = PostaBranchSerializer(branches, many=True)
        return Response({'success': True, 'data': serializer.data})

    elif request.method == 'POST':
        serializer = PostaBranchSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([AllowAny])
def branch_detail(request, id):
    try:
        branch = PostaBranch.objects.get(id=id)
    except PostaBranch.DoesNotExist:
        return Response({'success': False, 'message': 'Branch not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = PostaBranchSerializer(branch)
        return Response({'success': True, 'data': serializer.data})

    elif request.method == 'PUT':
        serializer = PostaBranchSerializer(branch, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'data': serializer.data})
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        branch.delete()
        return Response({'success': True, 'message': 'Branch deleted'})


@api_view(['POST'])
@permission_classes([AllowAny])
def bulk_import_branches(request):
    data = request.data
    if isinstance(data, list):
        items = data
    elif isinstance(data, dict) and 'branches' in data:
        items = data['branches']
    else:
        items = [data]

    created = []
    errors = []
    for item in items:
        serializer = PostaBranchSerializer(data=item)
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
