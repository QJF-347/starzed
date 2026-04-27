from rest_framework import serializers
from .models import Endorsement


class EndorsementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Endorsement
        fields = [
            'id', 'policy_number', 'client_name', 'product',
            'insurer', 'endorsement_type', 'description', 'amount',
            'effective_date', 'status', 'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']
