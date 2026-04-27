import uuid
from django.db import models


class MotorVehicle(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    registration_number = models.CharField(max_length=100)
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.IntegerField(blank=True, null=True)
    engine_number = models.CharField(max_length=100, blank=True)
    chassis_number = models.CharField(max_length=100, blank=True)
    client_name = models.CharField(max_length=200, blank=True)
    status = models.CharField(max_length=20, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Motor Vehicle'
        verbose_name_plural = 'Motor Vehicles'
        ordering = ['registration_number']

    def __str__(self):
        return f"{self.registration_number} - {self.make} {self.model}"
