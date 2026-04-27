from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Blog
from .serializers import BlogSerializer

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def blog_list(request):
    blogs = Blog.objects.filter(published=True).order_by('-created_at')
    serializer = BlogSerializer(blogs, many=True)
    return Response({
        'success': True,
        'data': serializer.data
    })

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def blog_detail(request, id):
    try:
        blog = Blog.objects.get(id=id, published=True)
        serializer = BlogSerializer(blog)
        return Response({
            'success': True,
            'data': serializer.data
        })
    except Blog.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Blog not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def blog_create(request):
    serializer = BlogSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'success': True,
            'message': 'Blog created successfully',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)
    return Response({
        'success': False,
        'message': 'Validation errors',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
def blog_update(request, id):
    try:
        blog = Blog.objects.get(id=id)
        serializer = BlogSerializer(blog, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Blog updated successfully',
                'data': serializer.data
            })
        return Response({
            'success': False,
            'message': 'Validation errors',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    except Blog.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Blog not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def blog_delete(request, id):
    try:
        blog = Blog.objects.get(id=id)
        blog.delete()
        return Response({
            'success': True,
            'message': 'Blog deleted successfully'
        })
    except Blog.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Blog not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def featured_blogs_list(request):
    """
    Get featured blogs
    """
    featured_blogs = Blog.objects.filter(published=True, featured=True).order_by('-created_at')
    serializer = BlogSerializer(featured_blogs, many=True)
    return Response({
        'success': True,
        'data': serializer.data
    })

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def blogs_by_category(request, category):
    """
    Get blogs by category
    """
    blogs = Blog.objects.filter(published=True, category=category).order_by('-created_at')
    serializer = BlogSerializer(blogs, many=True)
    return Response({
        'success': True,
        'data': serializer.data
    })
