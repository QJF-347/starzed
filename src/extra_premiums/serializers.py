from rest_framework import serializers
from .models import ExtraPremium


class ExtraPremiumSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExtraPremium
        fields = '__all__'
