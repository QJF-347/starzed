from rest_framework import serializers
from .models import PostaBranch


class PostaBranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostaBranch
        fields = '__all__'


class BulkImportSerializer(serializers.Serializer):
    branches = PostaBranchSerializer(many=True)
