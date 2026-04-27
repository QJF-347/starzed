from rest_framework import serializers
from .models import Contact

class ContactSerializer(serializers.ModelSerializer):
    _id = serializers.UUIDField(source='id', read_only=True)
    
    class Meta:
        model = Contact
        fields = ['_id', 'id', 'name', 'email', 'subject', 'message', 
                 'recipient_email', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
