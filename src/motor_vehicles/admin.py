from django.contrib import admin
from .models import MotorVehicle


@admin.register(MotorVehicle)
class MotorVehicleAdmin(admin.ModelAdmin):
    list_display = ['registration_number', 'make', 'model', 'year', 'client_name', 'status']
    search_fields = ['registration_number', 'make', 'client_name']
