from rest_framework import serializers
from .models import AgentFile


class AgentFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentFile
        fields = [
            'id', 'file_no', 'file_name', 'file_type',
            'file_url', 'description', 'client_name',
            'policy_number', 'uploaded_by', 'upload_date',
            'status', 'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']
