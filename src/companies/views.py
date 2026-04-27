from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Company, CompanyReview
from .serializers import CompanySerializer, CompanyReviewSerializer

@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def company_list(request):
    if request.method == 'GET':
        companies = Company.objects.filter(active=True).order_by('-created_at')
        serializer = CompanySerializer(companies, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })
    elif request.method == 'POST':
        serializer = CompanySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Company created successfully',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'success': False,
            'message': 'Validation errors',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def company_detail(request, id):
    try:
        company = Company.objects.get(id=id)
        if request.method == 'GET':
            serializer = CompanySerializer(company)
            return Response({
                'success': True,
                'data': serializer.data
            })
        elif request.method == 'PUT':
            serializer = CompanySerializer(company, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'success': True,
                    'message': 'Company updated successfully',
                    'data': serializer.data
                })
            return Response({
                'success': False,
                'message': 'Validation errors',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        elif request.method == 'DELETE':
            company.delete()
            return Response({
                'success': True,
                'message': 'Company deleted successfully'
            })
    except Company.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Company not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def company_review_list(request, company_id):
    try:
        company = Company.objects.get(id=company_id)
        if request.method == 'GET':
            reviews = company.company_reviews.all().order_by('-created_at')
            serializer = CompanyReviewSerializer(reviews, many=True)
            return Response({
                'success': True,
                'data': serializer.data
            })
        elif request.method == 'POST':
            serializer = CompanyReviewSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(company=company, user=request.user if request.user.is_authenticated else None)
                return Response({
                    'success': True,
                    'message': 'Review submitted successfully',
                    'data': serializer.data
                }, status=status.HTTP_201_CREATED)
            return Response({
                'success': False,
                'message': 'Validation errors',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
    except Company.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Company not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def company_products(request, company_id):
    """
    Get products for a company (returns all generic products since products are not company-specific)
    """
    try:
        company = Company.objects.get(id=company_id)
        # Since products are generic and not tied to companies, return all products
        from products.models import Product
        from products.serializers import ProductSerializer

        products = Product.objects.all().order_by('-created_at')
        serializer = ProductSerializer(products, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })
    except Company.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Company not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def bulk_import_companies(request):
    """
    Bulk import companies from Excel data
    """
    companies_data = request.data.get('companies', [])
    created_companies = []
    failed_companies = []
    
    for company_data in companies_data:
        name = company_data.get('name', '').strip()
        if not name:
            failed_companies.append({'data': company_data, 'error': 'Company name is required'})
            continue
            
        try:
            company = Company.objects.create(
                name=name,
                display_name=company_data.get('display_name', name).strip(),
                description=company_data.get('description', '').strip(),
                logo=company_data.get('logo', '').strip(),
                website=company_data.get('website', '').strip(),
                contact={
                    'phone': company_data.get('mobile', '').strip(),
                    'email': company_data.get('email', '').strip(),
                    'address': company_data.get('address', '').strip()
                },
                established=company_data.get('established', 2024),
                headquarters=company_data.get('headquarters', '').strip(),
                licensed=True,
                active=True
            )
            created_companies.append({
                'name': company.name, 
                'id': str(company.id),
                'display_name': company.display_name
            })
        except Exception as e:
            failed_companies.append({'data': company_data, 'error': str(e)})
    
    return Response({
        'success': True,
        'message': f'Import completed. Created: {len(created_companies)}, Failed: {len(failed_companies)}',
        'created_companies': created_companies,
        'failed_companies': failed_companies
    })
