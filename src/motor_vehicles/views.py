from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import MotorVehicle
from .serializers import MotorVehicleSerializer


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def vehicle_list(request):
    if request.method == 'GET':
        vehicles = MotorVehicle.objects.all()
        serializer = MotorVehicleSerializer(vehicles, many=True)
        return Response({'success': True, 'data': serializer.data})

    elif request.method == 'POST':
        serializer = MotorVehicleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([AllowAny])
def vehicle_detail(request, id):
    try:
        vehicle = MotorVehicle.objects.get(id=id)
    except MotorVehicle.DoesNotExist:
        return Response({'success': False, 'message': 'Vehicle not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = MotorVehicleSerializer(vehicle)
        return Response({'success': True, 'data': serializer.data})

    elif request.method == 'PUT':
        serializer = MotorVehicleSerializer(vehicle, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'data': serializer.data})
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        vehicle.delete()
        return Response({'success': True, 'message': 'Vehicle deleted'})


@api_view(['POST'])
@permission_classes([AllowAny])
def bulk_import_vehicles(request):
    data = request.data
    if isinstance(data, list):
        items = data
    elif isinstance(data, dict) and 'vehicles' in data:
        items = data['vehicles']
    else:
        items = [data]

    created = []
    errors = []
    for item in items:
        serializer = MotorVehicleSerializer(data=item)
        if serializer.is_valid():
            serializer.save()
            created.append(serializer.data)
        else:
            errors.append({'input': item, 'errors': serializer.errors})

    return Response({
        'success': True,
        'created': len(created),
        'errors': len(errors),
        'data': created,
        'error_details': errors if errors else None
    })
