"""
URL configuration for starzed_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse, HttpResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json
import os
import uuid
from datetime import datetime
from users import views as users_views

# Import error handlers
from .error_handlers import handler400, handler403, handler404, handler500

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    return Response({'status': 'OK', 'message': 'Django Backend API is running'})

# Simple root endpoint for debugging
def root_view(request):
    return HttpResponse("Starzed Backend API - Running", content_type="text/plain")

@api_view(['GET'])
@permission_classes([AllowAny])
def test_endpoint(request):
    return Response({'status': 'success', 'message': 'Test endpoint working', 'timestamp': str(datetime.now())})

@api_view(['GET'])
@permission_classes([AllowAny])
def debug_endpoint(request):
    """Simple debug endpoint that doesn't require database"""
    return Response({
        'debug': True,
        'django_working': True,
        'method': request.method,
        'path': request.path,
        'headers': dict(request.headers),
        'get_params': dict(request.GET)
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def db_status(request):
    """Check database connection and table status"""
    try:
        from django.db import connection
        from django.apps import apps

        # Test database connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            db_status = "Connected"

        try:
            table_names = connection.introspection.table_names()
        except Exception:
            table_names = []

        db_info = {
            'vendor': getattr(connection, 'vendor', None),
            'name': connection.settings_dict.get('NAME'),
            'engine': connection.settings_dict.get('ENGINE'),
            'host': connection.settings_dict.get('HOST'),
            'port': connection.settings_dict.get('PORT'),
        }

        # Check if tables exist
        tables_info = {}
        app_configs = ['users', 'clients', 'products', 'blogs', 'policies', 'companies', 'quotes', 'contacts']

        for app_name in app_configs:
            try:
                app_config = apps.get_app_config(app_name)
                models = list(app_config.get_models())
                model_names = [model.__name__ for model in models]

                model_table_status = {}
                for model in models:
                    try:
                        table = model._meta.db_table
                        model_table_status[model.__name__] = {
                            'db_table': table,
                            'table_exists': table in table_names,
                        }
                    except Exception:
                        model_table_status[model.__name__] = {
                            'db_table': None,
                            'table_exists': False,
                        }

                tables_info[app_name] = {
                    'status': 'App loaded',
                    'models': model_names,
                    'model_tables': model_table_status,
                }
            except:
                tables_info[app_name] = {
                    'status': 'App not found',
                    'models': []
                }

        return Response({
            'status': 'success',
            'database': db_status,
            'database_info': db_info,
            'table_count': len(table_names),
            'table_names': sorted(table_names),
            'tables': tables_info,
            'message': 'Database diagnostic complete'
        })

    except Exception as e:
        return Response({
            'status': 'error',
            'database': 'Not connected',
            'error': str(e),
            'message': 'Database connection failed'
        })

@api_view(['GET'])
@permission_classes([AllowAny])
def users_root(request):
    """Root endpoint for /api/users/ - lists available user endpoints"""
    return Response({
        'success': True,
        'message': 'User API endpoints',
        'endpoints': {
            'register': '/api/users/register/',
            'login': '/api/users/login/',
            'profile': '/api/users/profile/',
            'update_profile': '/api/users/profile/update/',
            'admin_users': '/api/admin/users/'
        },
        'note': 'Admin endpoints require authentication and admin privileges'
    })

@api_view(['POST', 'DELETE'])
@permission_classes([AllowAny])
@csrf_exempt
def upload_image(request):
    """
    Image upload endpoint that accepts base64 image data
    """
    import os
    import base64
    from django.conf import settings
    from django.core.files.storage import default_storage
    from django.core.files.base import ContentFile

    if request.method == 'DELETE':
        try:
            path = request.data.get('path', '')
            if path and default_storage.exists(path):
                default_storage.delete(path)
                return Response({'success': True, 'message': 'Image deleted'})
            return Response({'success': False, 'message': 'Image not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'success': False, 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    try:
        image_data = request.data.get('image', '')
        filename = request.data.get('filename', f'image_{uuid.uuid4()}.jpg')

        if not image_data:
            return Response({'success': False, 'message': 'No image data provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Handle base64 data
        if ';base64,' in image_data:
            fmt, img_str = image_data.split(';base64,')
            ext = fmt.split('/')[-1] if '/' in fmt else 'jpg'
            filename = filename.rsplit('.', 1)[0] + '.' + ext
            image_bytes = base64.b64decode(img_str)
        else:
            image_bytes = image_data.encode()

        upload_dir = 'uploads/images'
        full_upload_dir = os.path.join(
            settings.MEDIA_ROOT if hasattr(settings, 'MEDIA_ROOT') else 'media',
            upload_dir
        )
        os.makedirs(full_upload_dir, exist_ok=True)

        file_path = default_storage.save(f"{upload_dir}/{filename}", ContentFile(image_bytes))
        file_url = default_storage.url(file_path)

        return Response({
            'success': True,
            'message': 'Image uploaded successfully',
            'data': {
                'url': file_url,
                'path': file_path,
                'filename': filename
            }
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({
            'success': False,
            'message': f'Error uploading image: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def upload_file(request):
    """
    File upload endpoint with actual file handling
    """
    import os
    from django.conf import settings
    from django.core.files.storage import default_storage
    from django.core.files.base import ContentFile
    import uuid
    
    try:
        if 'file' not in request.FILES:
            return Response({
                'success': False,
                'message': 'No file provided'
            }, status=status.HTTP_400_BAD_REQUEST)

        file = request.FILES['file']
        
        # Validate file size (max 10MB)
        max_size = 10 * 1024 * 1024  # 10MB
        if file.size > max_size:
            return Response({
                'success': False,
                'message': 'File size too large. Maximum size is 10MB.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Generate unique filename
        file_extension = os.path.splitext(file.name)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        
        # Create upload directory if it doesn't exist
        upload_dir = 'uploads'
        # Note: default_storage.makedirs() doesn't exist, use os.makedirs instead
        import os
        full_upload_dir = os.path.join(settings.MEDIA_ROOT if hasattr(settings, 'MEDIA_ROOT') else 'media', upload_dir)
        os.makedirs(full_upload_dir, exist_ok=True)
        
        # Save file
        file_path = default_storage.save(f"{upload_dir}/{unique_filename}", ContentFile(file.read()))
        
        # Get file URL
        file_url = default_storage.url(file_path)
        
        file_info = {
            'name': file.name,
            'original_name': file.name,
            'unique_name': unique_filename,
            'size': file.size,
            'content_type': file.content_type,
            'url': file_url,
            'path': file_path
        }

        return Response({
            'success': True,
            'message': 'File uploaded successfully',
            'data': file_info
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({
            'success': False,
            'message': f'Error uploading file: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def upload_to_google_drive(request):
    """
    Upload file to Google Drive endpoint
    """
    try:
        if 'file' not in request.FILES:
            return Response({
                'success': False,
                'message': 'No file provided'
            }, status=status.HTTP_400_BAD_REQUEST)

        file = request.FILES['file']
        company_id = request.data.get('company_id', None)
        company_name = request.data.get('company_name', None)
        client_id = request.data.get('client_id', None)
        client_name = request.data.get('client_name', None)
        description = request.data.get('description', '')
        
        # Import Google Drive service
        from services.google_drive import upload_file_to_google_drive
        
        # Upload to Google Drive and save to database
        result = upload_file_to_google_drive(
            file, 
            file.name, 
            company_id=company_id, 
            company_name=company_name,
            client_id=client_id,
            client_name=client_name,
            description=description
        )
        
        if result['success']:
            return Response(result, status=status.HTTP_201_CREATED)
        else:
            return Response(result, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        return Response({
            'success': False,
            'message': f'Error uploading to Google Drive: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_google_auth_url(request):
    """
    Get Google OAuth authorization URL
    """
    try:
        from services.google_drive import GoogleDriveService
        
        drive_service = GoogleDriveService()
        auth_url = drive_service.get_auth_url()
        
        return Response({
            'success': True,
            'data': {
                'auth_url': auth_url
            }
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'message': f'Error generating auth URL: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def handle_google_callback(request):
    """
    Handle Google OAuth callback
    """
    try:
        code = request.data.get('code')
        state = request.data.get('state', '')
        
        if not code:
            return Response({
                'success': False,
                'message': 'Authorization code required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        from services.google_drive import GoogleDriveService
        
        drive_service = GoogleDriveService()
        tokens = drive_service.exchange_code_for_tokens(code)
        
        # TODO: Store tokens securely (session, database, etc.)
        # For now, just return success
        
        return Response({
            'success': True,
            'message': 'Authentication successful',
            'data': {
                'access_token': tokens.get('access_token', ''),
                'refresh_token': tokens.get('refresh_token', ''),
                'expires_in': tokens.get('expires_in', 0)
            }
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'message': f'Error handling callback: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

urlpatterns = [
    path('', root_view, name='root'),
    path('admin/', admin.site.urls),
    path('api/', health_check, name='root_health'),
    path('api/users/', include('users.urls')),
    path('api/products/', include('products.urls')),
    path('api/blogs/', include('blogs.urls')),
    path('api/quotes/', include('quotes.urls')),
    path('api/contacts/', include('contacts.urls')),
    path('api/companies/', include('companies.urls')),
    path('api/clients/', include('clients.urls')),
    path('api/policies/', include('policies.urls')),
    path('api/insurance-types/', include('insurance_types.urls')),
    path('api/claims/', include('claims.urls')),
    path('api/posta-branches/', include('posta_branches.urls')),
    path('api/motor-vehicles/', include('motor_vehicles.urls')),
    path('api/extra-premiums/', include('extra_premiums.urls')),
    path('api/certificates/', include('certificates.urls')),
    path('api/renewals/', include('renewals.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/activities/', include('activities.urls')),
    path('api/files/', include('files.urls')),
    path('api/coverfile/', include('coverfile.urls')),
    path('api/premium-rates/', include('premium_rates.urls')),
    path('api/transactions/', include('transactions.urls')),
    path('api/endorsements/', include('endorsements.urls')),
    path('api/receipts-payments/', include('receipts_payments.urls')),
    path('api/payments/', include('receipts_payments.payment_urls')),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/health/', health_check, name='health_check'),
    path('api/test/', test_endpoint, name='test_endpoint'),
    path('api/debug/', debug_endpoint, name='debug_endpoint'),
    path('api/db-status/', db_status, name='db_status'),
    path('api/upload/', upload_file, name='upload_file'),
    path('api/upload/image/', upload_image, name='upload_image'),
    path('api/upload/google-drive/', upload_to_google_drive, name='upload_to_google_drive'),
    path('api/auth/google/url/', get_google_auth_url, name='get_google_auth_url'),
    path('api/auth/google/callback/', handle_google_callback, name='handle_google_callback'),
        # Admin endpoints that frontend expects at /api/admin/*
    path('api/admin/users/', users_views.admin_users, name='admin_users'),
    path('api/admin/users/seed/', users_views.seed_database, name='admin_seed'),
    path('api/admin/users/clear/', users_views.clear_database, name='admin_clear'),
    path('api/admin/users/<uuid:user_id>/', users_views.admin_user_detail, name='admin_user_detail'),
    path('api/admin/users/<uuid:user_id>/toggle-status/', users_views.admin_toggle_user_status, name='admin_toggle_user_status'),
]
