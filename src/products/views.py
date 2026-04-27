from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.core.management import call_command
from .models import Product
from .serializers import ProductSerializer

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def product_list(request):
    products = Product.objects.all().order_by('-created_at')
    serializer = ProductSerializer(products, many=True)
    return Response({
        'success': True,
        'data': serializer.data
    })

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def product_detail(request, id):
    try:
        product = Product.objects.get(id=id)
        serializer = ProductSerializer(product)
        return Response({
            'success': True,
            'data': serializer.data
        })
    except Product.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Product not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def product_create(request):
    serializer = ProductSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'success': True,
            'message': 'Product created successfully',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)
    return Response({
        'success': False,
        'message': 'Validation errors',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
def product_update(request, id):
    try:
        product = Product.objects.get(id=id)
        serializer = ProductSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Product updated successfully',
                'data': serializer.data
            })
        return Response({
            'success': False,
            'message': 'Validation errors',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    except Product.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Product not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def product_delete(request, id):
    try:
        product = Product.objects.get(id=id)
        product.delete()
        return Response({
            'success': True,
            'message': 'Product deleted successfully'
        })
    except Product.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Product not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST', 'GET'])
@permission_classes([permissions.AllowAny])
def fix_eligibility_field(request):
    """
    Fix the missing eligibility field in the products table
    """
    try:
        # Import and run the emergency fix script
        import subprocess
        import sys
        
        result = subprocess.run(
            [sys.executable, 'emergency_fix.py'],
            capture_output=True,
            text=True,
            cwd='/app/src'  # Render deployment path
        )
        
        if result.returncode == 0:
            return Response({
                'success': True,
                'message': 'Eligibility field fixed successfully',
                'output': result.stdout
            })
        else:
            return Response({
                'success': False,
                'message': f'Error fixing eligibility field: {result.stderr}',
                'output': result.stdout
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    except Exception as e:
        return Response({
            'success': False,
            'message': f'Error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def bulk_import_products(request):
    """
    Bulk import products from Excel/CSV data
    """
    products_data = request.data.get('products', [])
    created_products = []
    failed_products = []
    
    for product_data in products_data:
        product_name = product_data.get('productName', '').strip()
        if not product_name:
            failed_products.append({'data': product_data, 'error': 'Product name is required'})
            continue
            
        try:
            product = Product.objects.create(
                id=product_data.get('id', f"product_{len(created_products + failed_products)}"),
                title=product_name,
                category=product_data.get('insurer', 'General'),
                short_description=product_data.get('description', product_name),
                description=product_data.get('description', product_name),
                features=[],
                benefits=[],
                coverage='',
                premium=str(product_data.get('minRate', 0)),
                icon='shield',
                image='/assets/default-product.png',
                popular=False,
                eligibility={}
            )
            created_products.append({
                'id': product.id,
                'title': product.title,
                'category': product.category
            })
        except Exception as e:
            failed_products.append({'data': product_data, 'error': str(e)})
    
    return Response({
        'success': True,
        'message': f'Import completed. Created: {len(created_products)}, Failed: {len(failed_products)}',
        'created_products': created_products,
        'failed_products': failed_products
    })
