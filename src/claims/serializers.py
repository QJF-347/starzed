from rest_framework import serializers
from .models import Claim


class ClaimSerializer(serializers.ModelSerializer):
    class Meta:
        model = Claim
        fields = [
            'id',
            'client_name',
            'policy_number',
            'claim_number',
            'date',
            'insurance_class',
            'claim_type',
            'status',
            'amount',
            'paid',
            'balance',
            'item',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']
