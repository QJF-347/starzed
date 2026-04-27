from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from django.db import IntegrityError
from .models import Policy, CompanyPlan
from .serializers import PolicySerializer, CompanyPlanSerializer

@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
@parser_classes([MultiPartParser, FormParser])
def policy_list(request):
    if request.method == 'GET':
        policies = Policy.objects.all().order_by('-created_at')
        serializer = PolicySerializer(policies, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })
    elif request.method == 'POST':
        serializer = PolicySerializer(data=request.data)
        try:
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'success': True,
                    'message': 'Policy created successfully',
                    'data': serializer.data
                }, status=status.HTTP_201_CREATED)
            return Response({
                'success': False,
                'message': 'Validation errors',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        except IntegrityError as e:
            return Response({
                'success': False,
                'message': 'Database integrity error',
                'errors': {
                    'non_field_errors': [str(e)]
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'success': False,
                'message': 'Error creating policy',
                'errors': {
                    'non_field_errors': [str(e)]
                }
            }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def policy_detail(request, id):
    try:
        policy = Policy.objects.get(id=id)
        if request.method == 'GET':
            serializer = PolicySerializer(policy)
            return Response({
                'success': True,
                'data': serializer.data
            })
        elif request.method == 'PUT':
            serializer = PolicySerializer(policy, data=request.data, partial=True)
            try:
                if serializer.is_valid():
                    serializer.save()
                    return Response({
                        'success': True,
                        'message': 'Policy updated successfully',
                        'data': serializer.data
                    })
                return Response({
                    'success': False,
                    'message': 'Validation errors',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            except IntegrityError as e:
                return Response({
                    'success': False,
                    'message': 'Database integrity error',
                    'errors': {
                        'non_field_errors': [str(e)]
                    }
                }, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({
                    'success': False,
                    'message': 'Error updating policy',
                    'errors': {
                        'non_field_errors': [str(e)]
                    }
                }, status=status.HTTP_400_BAD_REQUEST)
        elif request.method == 'DELETE':
            policy.delete()
            return Response({
                'success': True,
                'message': 'Policy deleted successfully'
            })
    except Policy.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Policy not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def company_plan_list(request):
    if request.method == 'GET':
        plans = CompanyPlan.objects.filter(active=True).order_by('-created_at')
        serializer = CompanyPlanSerializer(plans, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })
    elif request.method == 'POST':
        serializer = CompanyPlanSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Company plan created successfully',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'success': False,
            'message': 'Validation errors',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def company_plan_detail(request, id):
    try:
        plan = CompanyPlan.objects.get(id=id)
        if request.method == 'GET':
            serializer = CompanyPlanSerializer(plan)
            return Response({
                'success': True,
                'data': serializer.data
            })
        elif request.method == 'PUT':
            serializer = CompanyPlanSerializer(plan, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'success': True,
                    'message': 'Company plan updated successfully',
                    'data': serializer.data
                })
            return Response({
                'success': False,
                'message': 'Validation errors',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        elif request.method == 'DELETE':
            plan.delete()
            return Response({
                'success': True,
                'message': 'Company plan deleted successfully'
            })
    except CompanyPlan.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Company plan not found'
        }, status=status.HTTP_404_NOT_FOUND)
