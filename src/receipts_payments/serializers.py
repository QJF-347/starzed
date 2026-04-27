from rest_framework import serializers
from .models import CustomerReceipt, InsurerPayment, Premium, PremiumPaymentLog, PaymentLink


class CustomerReceiptSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerReceipt
        fields = [
            'id', 'receipt_no', 'client_name', 'policy_number',
            'amount', 'payment_method', 'receipt_date', 'notes',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']


class InsurerPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = InsurerPayment
        fields = [
            'id', 'payment_no', 'insurer_name', 'policy_number',
            'amount', 'payment_method', 'payment_date', 'notes',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']


class PremiumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Premium
        fields = [
            'id', 'premium_no', 'client_name', 'policy_number',
            'amount', 'premium_type', 'due_date', 'status',
            'notes', 'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']


class PremiumPaymentLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = PremiumPaymentLog
        fields = [
            'id', 'log_no', 'client_name', 'policy_number',
            'amount', 'payment_method', 'payment_date', 'status',
            'notes', 'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']


class PaymentLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentLink
        fields = [
            'id', 'client_name', 'policy_number', 'amount',
            'link_url', 'status', 'expires_at', 'created_at', 'updated_at',
            'meta',
        ]
        read_only_fields = ['created_at', 'updated_at']
