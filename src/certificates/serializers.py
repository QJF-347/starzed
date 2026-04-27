from rest_framework import serializers
from .models import Certificate, CertificateIssue, CertificateDeclaration


class CertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = [
            'id', 'certificate_no', 'insurer', 'date', 'user_name',
            'status', 'item', 'd_expiry', 'amount',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']


class CertificateIssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = CertificateIssue
        fields = [
            'id', 'client_name', 'policy_number', 'vehicle_item',
            'amount_paid', 'certificate_amount', 'certificate_no',
            'date_from', 'expiry_date', 'no_of_months', 'remarks',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']


class CertificateDeclarationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CertificateDeclaration
        fields = [
            'id', 'certificate_no', 'client_name', 'insurer',
            'declaration_text', 'signed_date',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']
