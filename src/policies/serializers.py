from rest_framework import serializers
from .models import Policy, CompanyPlan
from products.serializers import ProductSerializer
from companies.serializers import CompanySerializer

class PolicySerializer(serializers.ModelSerializer):
    _id = serializers.UUIDField(source='id', read_only=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)

    class Meta:
        model = Policy
        fields = ['_id', 'id', 'title', 'description', 'icon', 'image', 'image_url',
                 'link', 'path', 'createdAt', 'updatedAt']
        read_only_fields = ['id', 'createdAt', 'updatedAt']

        extra_kwargs = {
            'image': {'required': False, 'allow_null': True},
            'image_url': {'required': False, 'allow_null': True, 'allow_blank': True},
            'path': {'required': False, 'allow_null': True, 'allow_blank': True},
        }

    def to_internal_value(self, data):
        # Handle camelCase to snake_case conversion
        if 'createdAt' in data:
            data['created_at'] = data.pop('createdAt')
        if 'updatedAt' in data:
            data['updated_at'] = data.pop('updatedAt')
        return super().to_internal_value(data)

class CompanyPlanSerializer(serializers.ModelSerializer):
    _id = serializers.UUIDField(source='id', read_only=True)
    company_name = serializers.CharField(source='company.name', read_only=True)
    product_title = serializers.CharField(source='product.title', read_only=True)
    product_details = ProductSerializer(source='product', read_only=True)
    company_details = CompanySerializer(source='company', read_only=True)
    
    class Meta:
        model = CompanyPlan
        fields = ['_id', 'id', 'company', 'company_name', 'product', 'product_title', 
                 'product_details', 'company_details', 'branded_name', 'description', 
                 'features', 'benefits', 'coverage', 'premium', 'image', 
                 'popular', 'active', 'eligibility', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
