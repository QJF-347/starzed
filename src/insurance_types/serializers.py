from rest_framework import serializers
from .models import InsuranceType


class InsuranceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = InsuranceType
        fields = ['id', 'type', 'description', 'status', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
