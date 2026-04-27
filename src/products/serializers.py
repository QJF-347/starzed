from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    _id = serializers.CharField(source='id', read_only=True)
    shortDescription = serializers.CharField(source='short_description')
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)

    class Meta:
        model = Product
        fields = ['_id', 'id', 'title', 'category', 'shortDescription', 'description',
                 'features', 'benefits', 'coverage', 'premium', 'icon', 'image',
                 'popular', 'eligibility', 'createdAt', 'updatedAt']
        read_only_fields = ['createdAt', 'updatedAt']

    def to_internal_value(self, data):
        # Handle camelCase to snake_case conversion
        if 'shortDescription' in data:
            data['short_description'] = data.pop('shortDescription')
        if 'createdAt' in data:
            data['created_at'] = data.pop('createdAt')
        if 'updatedAt' in data:
            data['updated_at'] = data.pop('updatedAt')
        return super().to_internal_value(data)
