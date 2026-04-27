from rest_framework import serializers
from .models import Quote

class QuoteSerializer(serializers.ModelSerializer):
    _id = serializers.UUIDField(source='id', read_only=True)
    
    class Meta:
        model = Quote
        fields = ['_id', 'id', 'first_name', 'last_name', 'email', 'phone', 
                 'product', 'coverage', 'message', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def to_internal_value(self, data):
        # Handle camelCase to snake_case conversion
        if 'firstName' in data:
            data['first_name'] = data.pop('firstName')
        if 'lastName' in data:
            data['last_name'] = data.pop('lastName')
        return super().to_internal_value(data)
