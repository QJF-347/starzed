from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import transaction
from django.core.management import call_command
from django.views.decorators.csrf import csrf_exempt
from .models import User
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserSerializer


class IsAdminOrRoleAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        user = getattr(request, 'user', None)
        if not user or not user.is_authenticated:
            return False
        return bool(getattr(user, 'is_staff', False) or getattr(user, 'is_superuser', False) or getattr(user, 'role', None) == 'admin')

@csrf_exempt
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'success': True,
            'message': 'User registered successfully',
            'data': {
                'user': UserSerializer(user).data,
                'token': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }
        }, status=status.HTTP_201_CREATED)
    return Response({
        'success': False,
        'message': 'Validation errors',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login(request):
    serializer = UserLoginSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'success': True,
            'message': 'Login successful',
            'data': {
                'user': UserSerializer(user).data,
                'token': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }
        })
    return Response({
        'success': False,
        'message': 'Invalid credentials',
        'errors': serializer.errors
    }, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def profile(request):
    serializer = UserSerializer(request.user)
    return Response({
        'success': True,
        'data': serializer.data
    })

@api_view(['PUT', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_profile(request):
    serializer = UserSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'success': True,
            'message': 'Profile updated successfully',
            'data': serializer.data
        })
    return Response({
        'success': False,
        'message': 'Validation errors',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAdminOrRoleAdmin])
def seed_database(request):
    """
    Seed the database with initial data
    """
    try:
        # Call the management command to seed initial data
        call_command('setup_initial_data')
        
        return Response({
            'success': True,
            'message': 'Database seeded successfully'
        })
    except Exception as e:
        return Response({
            'success': False,
            'message': f'Error seeding database: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@csrf_exempt
@api_view(['DELETE'])
@permission_classes([IsAdminOrRoleAdmin])
def clear_database(request):
    """
    Clear all data from the database (except users)
    """
    import logging
    logger = logging.getLogger(__name__)
    
    try:
        from django.apps import apps
        from django.db import DatabaseError, ProgrammingError, connection

        cleared_models = []
        skipped_models = []
        failed_models = []
        total_deleted = 0
        
        logger.info("Starting database clear operation")

        # Specific models to clear (excluding User model to keep users)
        # Order matters to avoid FK constraint issues.
        models_to_clear = [
            # Delete dependent models first (models with FKs to other models)
            'clients.ClientDocument',      # depends on Client (table may not exist)
            'clients.ClientPolicy',        # depends on Client, Product
            'companies.CompanyDocument',   # depends on Company
            'companies.CompanyReview',     # depends on Company
            'policies.CompanyPlan',        # depends on Company, Product
            'claims.Claim',                # may have dependencies

            # Then delete the main models
            'clients.Client',
            'companies.Company',
            'products.Product',            # referenced by ClientPolicy and CompanyPlan
            'policies.Policy',             # may depend on Company
            'blogs.Blog',
            'quotes.Quote',
            'contacts.Contact',
        ]

        existing_tables = set(connection.introspection.table_names())

        # First pass: identify which tables actually exist
        client_docs_table = 'client_documents'
        client_docs_exists = client_docs_table in existing_tables

        # Process each model individually to avoid transaction rollbacks affecting other models
        for model_path in models_to_clear:
            try:
                logger.info(f"Processing model: {model_path}")
                app_name, model_name = model_path.split('.')
                model = apps.get_model(app_name, model_name)

                db_table = model._meta.db_table
                logger.info(f"Checking table {db_table} for model {model_path}")
                
                if db_table not in existing_tables:
                    msg = f"{model_path}: Table doesn't exist"
                    skipped_models.append(msg)
                    logger.warning(msg)
                    continue

                # Use individual transaction for each model to isolate failures
                try:
                    with transaction.atomic():
                        count = model.objects.count()
                        logger.info(f"Found {count} records in {model_path}")
                        
                        if count > 0:
                            model.objects.all().delete()
                            total_deleted += count
                            msg = f"{model_path} ({count} records)"
                            cleared_models.append(msg)
                            logger.info(f"Successfully deleted {count} records from {model_path}")
                        else:
                            msg = f"{model_path} (already empty)"
                            cleared_models.append(msg)
                            logger.info(f"Model {model_path} was already empty")
                except (DatabaseError, ProgrammingError) as e:
                    # Handle specific database errors like missing FK tables
                    error_msg = str(e).lower()
                    if 'relation' in error_msg and 'does not exist' in error_msg and model_path == 'clients.Client':
                        # Client model exists but the FK constraint references
                        # client_documents table which doesn't exist. Try raw SQL
                        # with CASCADE to bypass per-model FK constraints.
                        try:
                            logger.info(f"Attempting raw SQL cascade clear for {model_path}")
                            with connection.cursor() as cursor:
                                cursor.execute(f"DELETE FROM {db_table};")
                                count = model.objects.count()
                                total_deleted += count
                            msg = f"{model_path}: Cleared using raw SQL cascade"
                            cleared_models.append(msg)
                        except Exception as sql_error:
                            # Last resort: try TRUNCATE with CASCADE
                            try:
                                with connection.cursor() as cursor:
                                    cursor.execute(f"TRUNCATE TABLE {db_table} CASCADE;")
                                msg = f"{model_path}: Cleared using TRUNCATE CASCADE"
                                cleared_models.append(msg)
                            except Exception as trunc_error:
                                msg = f"{model_path}: All methods failed - ORM: {str(e)} | CASCADE: {str(sql_error)} | TRUNCATE: {str(trunc_error)}"
                                failed_models.append(msg)
                                logger.error(f"All clear methods failed for {model_path}")
                    elif 'relation' in error_msg and 'does not exist' in error_msg:
                        # Table itself doesn't exist — skip it
                        msg = f"{model_path}: Skipped (table doesn't exist)"
                        skipped_models.append(msg)
                        logger.warning(f"Table does not exist for {model_path}, skipping")
                    else:
                        msg = f"{model_path}: Database error - {str(e)}"
                        failed_models.append(msg)
                        logger.error(f"Database error clearing {model_path}: {str(e)}", exc_info=True)
                    continue

            except Exception as e:
                msg = f"{model_path}: {str(e)}"
                skipped_models.append(msg)
                logger.error(f"Unexpected error processing {model_path}: {str(e)}", exc_info=True)

        if failed_models:
            logger.error(f"Database clear completed with {len(failed_models)} failed models: {failed_models}")
            return Response({
                'success': False,
                'message': 'Database clear completed with errors; no data integrity guarantees. See failed_models.',
                'cleared_models': cleared_models,
                'skipped_models': skipped_models,
                'failed_models': failed_models,
                'total_deleted': total_deleted,
            })

        if total_deleted == 0:
            logger.info("Database clear completed: No records were deleted")
            return Response({
                'success': True,
                'message': 'No records were deleted (database was already empty or no target tables exist in this environment).',
                'cleared_models': cleared_models,
                'skipped_models': skipped_models,
                'failed_models': failed_models,
                'total_deleted': total_deleted,
            })

        logger.info(f"Database clear completed successfully: Deleted {total_deleted} records across {len(cleared_models)} models")
        return Response({
            'success': True,
            'message': 'Database cleared successfully (users preserved)',
            'cleared_models': cleared_models,
            'skipped_models': skipped_models,
            'failed_models': failed_models,
            'total_deleted': total_deleted,
        })
    except Exception as e:
        logger.critical(f"Critical error in clear_database: {str(e)}", exc_info=True)
        return Response({
            'success': False,
            'message': f'Error clearing database: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Admin user management endpoints
@api_view(['GET', 'POST'])
@permission_classes([IsAdminOrRoleAdmin])
def admin_users(request):
    """
    Handle GET (list users) and POST (create user) for admin
    """
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })
    elif request.method == 'POST':
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'success': True,
                'message': 'User created successfully',
                'data': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'success': False,
            'message': 'Validation errors',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAdminOrRoleAdmin])
def admin_user_detail(request, user_id):
    """
    Handle GET, PUT, DELETE for specific user (admin only)
    """
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({
            'success': False,
            'message': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response({
            'success': True,
            'data': serializer.data
        })
    elif request.method == 'PUT':
        serializer = UserSerializer(user, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'User updated successfully',
                'data': serializer.data
            })
        return Response({
            'success': False,
            'message': 'Validation errors',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        user.delete()
        return Response({
            'success': True,
            'message': 'User deleted successfully'
        })

@api_view(['PATCH'])
@permission_classes([IsAdminOrRoleAdmin])
def admin_toggle_user_status(request, user_id):
    """
    Toggle user active status (admin only)
    """
    try:
        user = User.objects.get(id=user_id)
        user.is_active = not user.is_active
        user.save()
        return Response({
            'success': True,
            'message': f'User status updated to {"active" if user.is_active else "inactive"}',
            'data': {
                'id': user.id,
                'is_active': user.is_active
            }
        })
    except User.DoesNotExist:
        return Response({
            'success': False,
            'message': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)
