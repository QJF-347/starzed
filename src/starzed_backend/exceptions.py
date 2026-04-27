"""
Custom exception handling for Django REST API
"""
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    """
    Custom exception handler that ensures API responses are always JSON
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)

    # If there is no response (e.g., Django's 404), create one
    if response is None:
        # Handle Django's Http404 and other exceptions
        if hasattr(exc, 'status_code'):
            status_code = exc.status_code
        else:
            status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        
        logger.error(f"Unhandled exception: {exc}")
        
        return Response({
            'success': False,
            'message': 'Resource not found' if status_code == 404 else 'Internal server error',
            'error': str(exc),
            'path': context['request'].path
        }, status=status_code)

    # Ensure the response is JSON format
    if not isinstance(response.data, dict):
        response.data = {
            'success': False,
            'message': 'An error occurred',
            'error': str(response.data)
        }
    
    # Add success field if not present
    if 'success' not in response.data:
        response.data['success'] = False
    
    # Add path information
    if 'path' not in response.data:
        response.data['path'] = context['request'].path

    return Response(response.data, status=response.status_code)
