from django.db import models
import uuid

class Product(models.Model):
    id = models.CharField(primary_key=True, max_length=50)
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    short_description = models.TextField()
    description = models.TextField()
    features = models.JSONField(default=list)
    benefits = models.JSONField(default=list)
    coverage = models.TextField(blank=True, null=True)
    premium = models.CharField(max_length=100, blank=True, null=True)
    icon = models.CharField(max_length=200)
    image = models.CharField(max_length=500)
    popular = models.BooleanField(default=False)
    eligibility = models.JSONField(default=dict, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'generic_products'
    
    def __str__(self):
        return self.title
