from django.db import models
import uuid
from users.models import User

class Company(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200, unique=True)
    display_name = models.CharField(max_length=200)
    description = models.TextField()
    logo = models.CharField(max_length=500)
    website = models.CharField(max_length=500)
    contact = models.JSONField(default=dict)
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=0)
    established = models.IntegerField()
    headquarters = models.CharField(max_length=200, blank=True, null=True)
    reviews = models.JSONField(default=list)
    licensed = models.BooleanField(default=True)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'companies'
    
    def __str__(self):
        return self.name

class CompanyReview(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='company_reviews')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    rating = models.IntegerField()
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'company_reviews'
        
    def __str__(self):
        return f"Review for {self.company.name} - {self.rating} stars"

class CompanyDocument(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='documents')
    file_name = models.CharField(max_length=255)
    file_size = models.BigIntegerField(default=0)
    mime_type = models.CharField(max_length=100, default='')
    google_drive_file_id = models.CharField(max_length=255, unique=True)
    google_drive_url = models.URLField(max_length=500)
    description = models.TextField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        db_table = 'company_documents'
        ordering = ['-uploaded_at']
        
    def __str__(self):
        return f"Document: {self.file_name} for {self.company.name}"
