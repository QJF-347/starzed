from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Quote
from .serializers import QuoteSerializer

@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def quote_list(request):
    if request.method == 'GET':
        quotes = Quote.objects.all().order_by('-created_at')
        serializer = QuoteSerializer(quotes, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })
    elif request.method == 'POST':
        serializer = QuoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Quote submitted successfully',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'success': False,
            'message': 'Validation errors',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def quote_detail(request, id):
    try:
        quote = Quote.objects.get(id=id)
        if request.method == 'GET':
            serializer = QuoteSerializer(quote)
            return Response({
                'success': True,
                'data': serializer.data
            })
        elif request.method == 'PUT':
            serializer = QuoteSerializer(quote, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'success': True,
                    'message': 'Quote updated successfully',
                    'data': serializer.data
                })
            return Response({
                'success': False,
                'message': 'Validation errors',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        elif request.method == 'DELETE':
            quote.delete()
            return Response({
                'success': True,
                'message': 'Quote deleted successfully'
            })
    except Quote.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Quote not found'
        }, status=status.HTTP_404_NOT_FOUND)
