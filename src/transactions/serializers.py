from rest_framework import serializers
from .models import Transaction, TransactionExtraPremium


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = [
            'id', 'category', 'policy_number', 'client_name',
            'product', 'insurer', 'transaction_type', 'amount',
            'transaction_date', 'status', 'notes', 'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']


class TransactionExtraPremiumSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionExtraPremium
        fields = [
            'id', 'policy_number', 'description', 'amount',
            'premium_type', 'status', 'created_at',
        ]
        read_only_fields = ['created_at']
