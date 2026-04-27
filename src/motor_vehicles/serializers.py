from rest_framework import serializers
from .models import MotorVehicle


class MotorVehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = MotorVehicle
        fields = '__all__'
