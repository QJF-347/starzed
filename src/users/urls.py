from django.urls import path
from . import views
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

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

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('profile/', views.profile, name='profile'),
    path('profile/update/', views.update_profile, name='update_profile'),
    path('', users_root, name='users_root'),
]
