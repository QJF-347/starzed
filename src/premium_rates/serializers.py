from rest_framework import serializers
from .models import InsurerPremiumRate


class InsurerPremiumRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = InsurerPremiumRate
        fields = [
            'id', 'insurer_name', 'category', 'rate',
            'description', 'effective_from', 'effective_to',
            'status', 'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']
