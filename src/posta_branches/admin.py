from django.contrib import admin
from .models import PostaBranch


@admin.register(PostaBranch)
class PostaBranchAdmin(admin.ModelAdmin):
    list_display = ['branch_name', 'branch_code', 'location', 'status']
    search_fields = ['branch_name', 'branch_code']
