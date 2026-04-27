from rest_framework import serializers
from .models import Cover


class CoverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cover
        fields = [
            'id', 'cover_category', 'client_name', 'policy_number',
            'insurer', 'product', 'start_date', 'expiry_date',
            'premium', 'status', 'notes', 'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']
