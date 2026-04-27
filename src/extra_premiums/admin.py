from django.contrib import admin
from .models import ExtraPremium


@admin.register(ExtraPremium)
class ExtraPremiumAdmin(admin.ModelAdmin):
    list_display = ['description', 'amount', 'premium_type', 'policy_number', 'status']
    search_fields = ['description', 'policy_number']
