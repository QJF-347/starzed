from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Contact
from .serializers import ContactSerializer

@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def contact_list(request):
    if request.method == 'GET':
        contacts = Contact.objects.all().order_by('-created_at')
        serializer = ContactSerializer(contacts, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })
    elif request.method == 'POST':
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Contact submitted successfully',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'success': False,
            'message': 'Validation errors',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def contact_detail(request, id):
    try:
        contact = Contact.objects.get(id=id)
        if request.method == 'GET':
            serializer = ContactSerializer(contact)
            return Response({
                'success': True,
                'data': serializer.data
            })
        elif request.method == 'PUT':
            serializer = ContactSerializer(contact, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'success': True,
                    'message': 'Contact updated successfully',
                    'data': serializer.data
                })
            return Response({
                'success': False,
                'message': 'Validation errors',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        elif request.method == 'DELETE':
            contact.delete()
            return Response({
                'success': True,
                'message': 'Contact deleted successfully'
            })
    except Contact.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Contact not found'
        }, status=status.HTTP_404_NOT_FOUND)
