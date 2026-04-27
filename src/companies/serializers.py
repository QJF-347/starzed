from rest_framework import serializers
from .models import Company, CompanyReview

class CompanySerializer(serializers.ModelSerializer):
    _id = serializers.UUIDField(source='id', read_only=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)

    class Meta:
        model = Company
        fields = ['_id', 'id', 'name', 'display_name', 'description', 'logo',
                 'website', 'contact', 'rating', 'established', 'headquarters',
                 'reviews', 'licensed', 'active', 'createdAt', 'updatedAt']
        read_only_fields = ['id', 'createdAt', 'updatedAt']

    def to_internal_value(self, data):
        # Handle camelCase to snake_case conversion
        if 'displayName' in data:
            data['display_name'] = data.pop('displayName')
        if 'createdAt' in data:
            data['created_at'] = data.pop('createdAt')
        if 'updatedAt' in data:
            data['updated_at'] = data.pop('updatedAt')
        return super().to_internal_value(data)

class CompanyReviewSerializer(serializers.ModelSerializer):
    _id = serializers.UUIDField(source='id', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = CompanyReview
        fields = ['_id', 'id', 'company', 'user', 'user_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'created_at']
