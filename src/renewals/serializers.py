from rest_framework import serializers
from .models import Renewal


class RenewalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Renewal
        fields = [
            'id', 'category', 'policy_number', 'client_name',
            'product', 'insurer', 'start_date', 'expiry_date',
            'premium', 'status', 'notes', 'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']
