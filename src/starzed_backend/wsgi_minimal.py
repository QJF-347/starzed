"""
Minimal WSGI application for debugging
"""
import os
import sys
import django
from django.core.wsgi import get_wsgi_application
from django.http import JsonResponse
from django.urls import path
from django.conf import settings

# Add current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Minimal Django settings
if not settings.configured:
    settings.configure(
        DEBUG=True,
        SECRET_KEY='django-insecure-minimal-debug-key',
        INSTALLED_APPS=[
            'django.contrib.contenttypes',
            'django.contrib.auth',
        ],
        DATABASES={
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': ':memory:',  # In-memory database for testing
            }
        },
        USE_TZ=True,
        ROOT_URLCONF=__name__,
        MIDDLEWARE=[],
    )
    django.setup()

# Simple views
def health_view(request):
    return JsonResponse({
        'status': 'OK',
        'message': 'Minimal Django Backend is running',
        'django_version': django.get_version(),
        'settings_configured': settings.configured
    })

def clients_view(request):
    return JsonResponse({
        'success': True,
        'data': []
    })

def policies_view(request):
    return JsonResponse({
        'success': True,
        'data': []
    })

# URL patterns
urlpatterns = [
    path('api/health/', health_view),
    path('api/clients/', clients_view),
    path('api/policies/', policies_view),
    path('', health_view),
]

# Get WSGI application
application = get_wsgi_application()
