"""
Custom error handlers for JSON API responses.
"""
from django.http import JsonResponse
from rest_framework import status
from rest_framework.views import exception_handler
from rest_framework.exceptions import APIException

def custom_exception_handler(exc, context):
    """
    Custom exception handler that returns JSON responses for all errors.
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)

    if response is not None:
        # If it's a REST framework exception, wrap it in our format
        response.data = {
            'success': False,
            'message': str(exc.detail) if hasattr(exc, 'detail') else str(exc),
            'errors': response.data if hasattr(response, 'data') else None
        }
    else:
        # For non-API exceptions, create a generic error response
        response = JsonResponse({
            'success': False,
            'message': 'Internal server error',
            'error': str(exc) if str(exc) else 'Unknown error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return response

def handler404(request, exception):
    """Handle 404 errors with JSON response."""
    return JsonResponse({
        'success': False,
        'message': 'Resource not found',
        'path': request.path
    }, status=404)

def handler500(request):
    """Handle 500 errors with JSON response."""
    return JsonResponse({
        'success': False,
        'message': 'Internal server error'
    }, status=500)

def handler400(request, exception):
    """Handle 400 errors with JSON response."""
    return JsonResponse({
        'success': False,
        'message': 'Bad request',
        'error': str(exception) if str(exception) else 'Invalid request'
    }, status=400)

def handler403(request, exception):
    """Handle 403 errors with JSON response."""
    return JsonResponse({
        'success': False,
        'message': 'Permission denied',
        'error': str(exception) if str(exception) else 'Access forbidden'
    }, status=403)