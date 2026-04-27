from rest_framework import serializers
from .models import Client, ClientPolicy, ClientDocument
from users.serializers import UserSerializer

class ClientSerializer(serializers.ModelSerializer):
    _id = serializers.UUIDField(source='id', read_only=True)
    agent_name = serializers.CharField(source='agent.get_full_name', read_only=True)
    
    class Meta:
        model = Client
        fields = ['_id', 'id', 'client_name', 'business_name', 'id_number', 'mobile',
                 'kra_pin', 'email', 'town', 'address', 'date_of_birth', 'agent', 'agent_name',
                 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class ClientPolicySerializer(serializers.ModelSerializer):
    _id = serializers.UUIDField(source='id', read_only=True)
    client_name = serializers.CharField(source='client.client_name', read_only=True)
    client_mobile = serializers.CharField(source='client.mobile', read_only=True)
    product_title = serializers.CharField(source='product.title', read_only=True)
    agent_name = serializers.CharField(source='agent.get_full_name', read_only=True)
    
    class Meta:
        model = ClientPolicy
        fields = ['_id', 'id', 'policy_number', 'client', 'client_name', 'client_mobile', 'product', 
                 'product_title', 'policy_type', 'cover_type', 'vehicle_details', 
                 'premium_amount', 'premium_balance', 'start_date', 'expiry_date', 
                 'status', 'agent', 'agent_name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ClientDocumentSerializer(serializers.ModelSerializer):
    _id = serializers.UUIDField(source='id', read_only=True)
    client_name = serializers.CharField(source='client.client_name', read_only=True)
    uploaded_by_email = serializers.EmailField(source='uploaded_by.email', read_only=True)

    class Meta:
        model = ClientDocument
        fields = [
            '_id',
            'id',
            'client',
            'client_name',
            'file_name',
            'file_size',
            'mime_type',
            'google_drive_file_id',
            'google_drive_url',
            'description',
            'uploaded_at',
            'uploaded_by',
            'uploaded_by_email',
        ]
        read_only_fields = [
            'id',
            'uploaded_at',
            'google_drive_file_id',
            'google_drive_url',
            'file_size',
            'mime_type',
            'uploaded_by',
        ]
