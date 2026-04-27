#!/usr/bin/env python3
"""
Django backend with proper database integration
"""
import os
import sys
import django
from django.conf import settings
from django.core.wsgi import get_wsgi_application
from django.http import JsonResponse, HttpResponse
from django.urls import path, include
from django.conf.urls.static import static
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db import connections
from django.core.management import execute_from_command_line
import json
from pathlib import Path
import dj_database_url

from datetime import timedelta

# Add src to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

# Configure Django settings
if not settings.configured:
    # Parse DATABASE_URL from Render for production
    if 'DATABASE_URL' in os.environ:
        DATABASES = {
            'default': dj_database_url.parse(os.environ['DATABASE_URL'])
        }
    else:
        # Fallback for local development
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.postgresql',
                'NAME': os.environ.get('DATABASE_NAME', 'starzed'),
                'USER': os.environ.get('DATABASE_USER', 'starzed_user'),
                'PASSWORD': os.environ.get('DATABASE_PASSWORD', ''),
                'HOST': os.environ.get('DATABASE_HOST', 'localhost'),
                'PORT': os.environ.get('DATABASE_PORT', '5432'),
                'OPTIONS': {}
            }
        }
    
    settings.configure(
        DEBUG=True,
        SECRET_KEY=os.environ.get('SECRET_KEY', 'django-insecure-production-key'),
        ALLOWED_HOSTS=['starzed.onrender.com', 'localhost', '127.0.0.1'],  # Allow starzed.onrender.com and local testing
        INSTALLED_APPS=[
            'django.contrib.contenttypes',
            'django.contrib.auth',
            'django.contrib.admin',
            'django.contrib.sessions',
            'django.contrib.messages',
            'django.contrib.staticfiles',
            'rest_framework',
            'rest_framework_simplejwt',
            'rest_framework_simplejwt.token_blacklist',
            'corsheaders',
            'users',
            'clients',
            'companies',
            'products',
            'policies',
            'blogs',
            'quotes',
            'contacts',
            'insurance_types',
            'claims',
            'posta_branches',
            'motor_vehicles',
            'extra_premiums',
            'starzed_backend',
            'certificates',
            'renewals',
            'reports',
            'activities',
            'files',
            'coverfile',
            'premium_rates',
            'transactions',
            'endorsements',
            'receipts_payments',
        ],
        DATABASES=DATABASES,
        USE_TZ=True,
        ROOT_URLCONF=__name__,
        MIDDLEWARE=[
            'corsheaders.middleware.CorsMiddleware',
            'django.middleware.security.SecurityMiddleware',
            'django.contrib.sessions.middleware.SessionMiddleware',
            'django.middleware.common.CommonMiddleware',
            'django.contrib.auth.middleware.AuthenticationMiddleware',
            'django.contrib.messages.middleware.MessageMiddleware',
            'django.middleware.clickjacking.XFrameOptionsMiddleware',
        ],
        CSRF_TRUSTED_ORIGINS=[
            'https://starzed.onrender.com',
            'https://starzed-v2.onrender.com',
        ],
        CORS_ALLOW_ALL_ORIGINS=True,
        CORS_ALLOW_CREDENTIALS=True,
        REST_FRAMEWORK={
            'DEFAULT_AUTHENTICATION_CLASSES': [
                'rest_framework_simplejwt.authentication.JWTAuthentication',
            ],
            'DEFAULT_PERMISSION_CLASSES': ['rest_framework.permissions.AllowAny'],
            'DEFAULT_RENDERER_CLASSES': ['rest_framework.renderers.JSONRenderer'],
        },
        SIMPLE_JWT={
            'ACCESS_TOKEN_LIFETIME': timedelta(days=7),
            'REFRESH_TOKEN_LIFETIME': timedelta(days=30),
            'ROTATE_REFRESH_TOKENS': True,
        },
        TEMPLATES=[
            {
                'BACKEND': 'django.template.backends.django.DjangoTemplates',
                'DIRS': [],
                'APP_DIRS': True,
                'OPTIONS': {
                    'context_processors': [
                        'django.template.context_processors.debug',
                        'django.template.context_processors.request',
                        'django.contrib.auth.context_processors.auth',
                        'django.contrib.messages.context_processors.messages',
                    ],
                },
            },
        ],
        STATIC_URL='/static/',
        STATIC_ROOT=os.path.join(os.path.dirname(__file__), 'staticfiles'),
        STATICFILES_DIRS=[
            os.path.join(os.path.dirname(__file__), 'dist'),           # Local development
            os.path.join(os.path.dirname(__file__), 'src', 'dist'),   # Production
        ],
        MEDIA_URL='/media/',
        MEDIA_ROOT=os.path.join(os.path.dirname(__file__), 'media'),
        AUTH_USER_MODEL='users.User',  # Use custom User model
        GOOGLE_CLIENT_ID=os.environ.get('GOOGLE_CLIENT_ID'),
        GOOGLE_CLIENT_SECRET=os.environ.get('GOOGLE_CLIENT_SECRET'),
        GOOGLE_REDIRECT_URI=os.environ.get('GOOGLE_REDIRECT_URI', 'https://starzed.onrender.com/api/auth/google/callback'),
        GOOGLE_ACCESS_TOKEN=os.environ.get('GOOGLE_ACCESS_TOKEN'),
        GOOGLE_REFRESH_TOKEN=os.environ.get('GOOGLE_REFRESH_TOKEN'),
    )

django.setup()

# Import Django models after setup
from clients.models import Client
from clients.serializers import ClientSerializer
from policies.models import Policy, CompanyPlan
from policies.serializers import PolicySerializer, CompanyPlanSerializer
from products.models import Product
from products.serializers import ProductSerializer
from companies.models import Company
from companies.serializers import CompanySerializer
from users.models import User
from users.serializers import UserSerializer
from users import views as users_views
from blogs.models import Blog
from blogs.serializers import BlogSerializer

# Reuse DRF upload/google endpoints implemented in starzed_backend.urls
from starzed_backend.urls import upload_file as drf_upload_file
from starzed_backend.urls import upload_to_google_drive as drf_upload_to_google_drive
from starzed_backend.urls import get_google_auth_url as drf_get_google_auth_url
from starzed_backend.urls import handle_google_callback as drf_handle_google_callback

def public_users_list(request):
    """Public users list endpoint (no authentication required)"""
    try:
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return JsonResponse({
            'success': True,
            'data': serializer.data
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Error: {str(e)}'
        }, status=500)

def get_blogs_compatible(request):
    """Compatibility endpoint for frontend getBlogs function"""
    try:
        blogs = Blog.objects.filter(published=True).order_by('-created_at')
        serializer = BlogSerializer(blogs, many=True)
        return JsonResponse({
            'success': True,
            'data': serializer.data
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Error: {str(e)}'
        }, status=500)

def run_migrations():
    """Run Django migrations"""
    try:
        execute_from_command_line(['manage.py', 'migrate', '--run-syncdb'])
        print("Migrations completed successfully")
    except Exception as e:
        print(f"Migration error: {e}")

def health_check(request):
    """Health check endpoint"""
    try:
        # Test database connection
        db_conn = connections['default']
        with db_conn.cursor() as cursor:
            cursor.execute("SELECT 1")
        
        return JsonResponse({
            'status': 'OK',
            'message': 'Django backend is healthy',
            'django_version': django.get_version(),
            'database': 'Connected',
            'settings_configured': settings.configured
        })
    except Exception as e:
        return JsonResponse({
            'status': 'ERROR',
            'message': f'Database connection failed: {str(e)}'
        }, status=500)

@csrf_exempt
@require_http_methods(["GET", "POST"])
def clients_list(request):
    """Clients API endpoint"""
    try:
        if request.method == 'GET':
            clients = Client.objects.all().order_by('-created_at')
            serializer = ClientSerializer(clients, many=True)
            return JsonResponse({
                'success': True,
                'data': serializer.data
            })
        elif request.method == 'POST':
            data = json.loads(request.body)
            serializer = ClientSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse({
                    'success': True,
                    'message': 'Client created successfully',
                    'data': serializer.data
                }, status=201)
            return JsonResponse({
                'success': False,
                'message': 'Validation errors',
                'errors': serializer.errors
            }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Error: {str(e)}'
        }, status=500)

@csrf_exempt
@require_http_methods(["GET", "PUT", "DELETE"])
def client_detail(request, client_id):
    """Client detail API endpoint"""
    try:
        client = Client.objects.get(id=client_id)
        
        if request.method == 'GET':
            serializer = ClientSerializer(client)
            return JsonResponse({
                'success': True,
                'data': serializer.data
            })
        elif request.method == 'PUT':
            data = json.loads(request.body)
            serializer = ClientSerializer(client, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse({
                    'success': True,
                    'message': 'Client updated successfully',
                    'data': serializer.data
                })
            return JsonResponse({
                'success': False,
                'message': 'Validation errors',
                'errors': serializer.errors
            }, status=400)
        elif request.method == 'DELETE':
            client.delete()
            return JsonResponse({
                'success': True,
                'message': 'Client deleted successfully'
            })
    except Client.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Client not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Error: {str(e)}'
        }, status=500)

def serve_frontend(request, path=None):
    """Serve React frontend or basic HTML"""
    try:
        # Debug: Print current working directory and file locations
        print(f"Current working directory: {os.getcwd()}")
        print(f"Django backend file location: {__file__}")
        
        # Try multiple possible locations for dist folder
        possible_dist_paths = [
            Path(__file__).parent / 'dist',           # Local development
            Path(__file__).parent / 'src' / 'dist',   # Production
        ]
        
        index_file = None
        dist_path = None
        
        for possible_dist in possible_dist_paths:
            test_index = possible_dist / 'index.html'
            print(f"Looking for index.html at: {test_index}")
            print(f"Exists: {test_index.exists()}")
            
            if test_index.exists():
                index_file = test_index
                dist_path = possible_dist
                break
        
        if index_file and index_file.exists():
            with open(index_file, 'r') as f:
                content = f.read()
                print(f"Successfully read index.html from {dist_path}, length: {len(content)}")
                return HttpResponse(content, content_type='text/html')
        else:
            # Return a basic HTML page if frontend not found
            basic_html = """
            <!DOCTYPE html>
            <html>
            <head>
                <title>STARZED - Django Backend Running</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    .container { max-width: 800px; margin: 0 auto; }
                    .success { color: green; }
                    .error { color: red; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>STARZED Django Backend</h1>
                    <p class="success">Django backend is running successfully!</p>
                    <p>Frontend build not found. The React app needs to be built.</p>
                    <p>Current working directory: {}</p>
                    <p>Searched paths: {}</p>
                    <hr>
                    <p><a href="/api/health/">Health Check</a></p>
                    <p><a href="/api/clients/">API Clients</a></p>
                </div>
            </body>
            </html>
            """.format(os.getcwd(), [str(p) for p in possible_dist_paths])
            
            return HttpResponse(basic_html, content_type='text/html')
    except Exception as e:
        print(f"Frontend serving error: {str(e)}")
        return JsonResponse({
            'error': f'Frontend error: {str(e)}',
            'cwd': os.getcwd(),
            'file_location': __file__
        }, status=500)

def test_static(request):
    """Test static file serving"""
    print(f"DEBUG: Test static endpoint called for path: {request.path}")
    return JsonResponse({
        'message': 'Test static endpoint working',
        'path': request.path,
        'method': request.method
    })

def serve_static(request, path):
    """Serve static files"""
    try:
        print(f"DEBUG: Static file request for path: {path}")
        
        # Look for files in the dist directory (same level as django_backend.py)
        dist_dir = Path(__file__).parent / 'dist'
        file_path = dist_dir / path
        
        print(f"DEBUG: Looking for file at: {file_path}")
        print(f"DEBUG: File exists: {file_path.exists()}")
        
        if file_path.exists():
            print(f"DEBUG: File suffix: {file_path.suffix}")
            
            if file_path.suffix in ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg']:
                with open(file_path, 'rb') as f:
                    content = f.read()
                
                # Determine content type
                if file_path.suffix == '.js':
                    content_type = 'application/javascript'
                elif file_path.suffix == '.css':
                    content_type = 'text/css'
                elif file_path.suffix in ['.png', '.jpg', '.jpeg', '.gif', '.ico']:
                    content_type = 'image/' + file_path.suffix[1:]
                elif file_path.suffix == '.svg':
                    content_type = 'image/svg+xml'
                else:
                    content_type = 'application/octet-stream'
                
                print(f"DEBUG: Serving static file with content type: {content_type}")
                print(f"DEBUG: Content length: {len(content)}")
                return HttpResponse(content, content_type=content_type)
            else:
                # For other files, serve index.html (React Router)
                print(f"DEBUG: File type not in allowed list, serving frontend")
                return serve_frontend(request)
        else:
            # If file doesn't exist, return 404
            print(f"DEBUG: File not found, returning 404")
            return JsonResponse({
                'error': 'Static file not found',
                'path': path,
                'searched_path': str(file_path)
            }, status=404)
    except Exception as e:
        print(f"DEBUG: Static file error: {str(e)}")
        return JsonResponse({
            'error': f'Static file error: {str(e)}'
        }, status=500)

# URL patterns
urlpatterns = [
    path('api/health/', health_check),
    path('api/clients/', include('clients.urls')),
    path('api/users/', include('users.urls')),
    path('api/policies/', include('policies.urls')),
    path('api/products/', include('products.urls')),
    path('api/companies/', include('companies.urls')),
    path('api/blogs/', include('blogs.urls')),
    path('api/certificates/', include('certificates.urls')),
    path('api/renewals/', include('renewals.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/activities/', include('activities.urls')),
    path('api/files/', include('files.urls')),
    path('api/cover-file/', include('coverfile.urls')),
    path('api/premium-rates/', include('premium_rates.urls')),
    path('api/transactions/', include('transactions.urls')),
    path('api/endorsements/', include('endorsements.urls')),
    path('api/receipts-payments/', include('receipts_payments.urls')),
    path('api/payments/', include('receipts_payments.payment_urls')),
    path('api/posta-branches/', include('posta_branches.urls')),
    path('api/motor-vehicles/', include('motor_vehicles.urls')),
    path('api/extra-premiums/', include('extra_premiums.urls')),
    path('api/upload/', drf_upload_file, name='upload_file'),
    path('api/upload/google-drive/', drf_upload_to_google_drive, name='upload_to_google_drive'),
    path('api/auth/google/url/', drf_get_google_auth_url, name='get_google_auth_url'),
    path('api/auth/google/callback/', drf_handle_google_callback, name='handle_google_callback'),
    path('api/get-blogs/', get_blogs_compatible, name='get_blogs_compatible'),
    path('api/admin/users/', users_views.admin_users, name='admin_users'),
    path('api/admin/users/seed/', users_views.seed_database, name='api_admin_seed'),
    path('api/admin/users/clear/', users_views.clear_database, name='api_admin_clear'),
    path('api/public-users/', public_users_list, name='public_users_list'),  # Public endpoint for testing
    path('test-static/', test_static),  # Test endpoint
    path('', serve_frontend),
]

# Add static files serving
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    # Try both locations for assets
    assets_path_local = os.path.join(os.path.dirname(__file__), 'dist', 'assets')
    assets_path_prod = os.path.join(os.path.dirname(__file__), 'src', 'dist', 'assets')
    
    if os.path.exists(assets_path_local):
        urlpatterns += static('/assets/', document_root=assets_path_local)
    elif os.path.exists(assets_path_prod):
        urlpatterns += static('/assets/', document_root=assets_path_prod)

# Catch-all for React Router (must be last)
urlpatterns += [
    path('<path:path>', serve_frontend),
]

# Add middleware to debug all requests
class DebugMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        print(f"DEBUG: {request.method} {request.path}")
        print(f"DEBUG: Request headers: {dict(request.headers)}")
        response = self.get_response(request)
        print(f"DEBUG: Response status: {response.status_code}")
        return response

# Add debug middleware to settings
settings.MIDDLEWARE.insert(0, 'django_backend.DebugMiddleware')

# Get WSGI application
application = get_wsgi_application()

if __name__ == '__main__':
    # Run migrations first
    print("Running Django migrations...")
    run_migrations()
    
    # Start server
    port = int(os.environ.get('PORT', 10000))
    print(f"Starting Django backend on port {port}...")
    
    # Use Django's development server with WSGI
    from django.core.servers.basehttp import run
    run(addr='0.0.0.0', port=port, wsgi_handler=application)
