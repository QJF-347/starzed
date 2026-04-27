from rest_framework import serializers
from .models import Blog

class BlogSerializer(serializers.ModelSerializer):
    _id = serializers.CharField(source='id', read_only=True)
    date = serializers.CharField(source='blog_date')
    readTime = serializers.CharField(source='read_time')
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)

    class Meta:
        model = Blog
        fields = ['_id', 'id', 'title', 'excerpt', 'content', 'author', 'date',
                 'readTime', 'category', 'image', 'tags', 'featured', 'published',
                 'createdAt', 'updatedAt']
        read_only_fields = ['createdAt', 'updatedAt']

    def to_internal_value(self, data):
        # Handle camelCase to snake_case conversion
        if 'date' in data:
            data['blog_date'] = data.pop('date')
        if 'readTime' in data:
            data['read_time'] = data.pop('readTime')
        if 'createdAt' in data:
            data['created_at'] = data.pop('createdAt')
        if 'updatedAt' in data:
            data['updated_at'] = data.pop('updatedAt')
        return super().to_internal_value(data)
