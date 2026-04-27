from django.db import models
import uuid
from users.models import User
from products.models import Product

class Client(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client_name = models.CharField(max_length=200)
    business_name = models.CharField(max_length=200, default='Individual')
    id_number = models.CharField(max_length=50, blank=True, null=True)
    mobile = models.CharField(max_length=20, blank=True, null=True)
    kra_pin = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    town = models.CharField(max_length=100, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    agent = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'clients'
    
    def __str__(self):
        return f"{self.client_name} - {self.business_name}"

class ClientDocument(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='documents')
    file_name = models.CharField(max_length=255)
    file_size = models.BigIntegerField(default=0)
    mime_type = models.CharField(max_length=100, default='')
    google_drive_file_id = models.CharField(max_length=255, unique=True)
    google_drive_url = models.URLField(max_length=500)
    description = models.TextField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        db_table = 'client_documents'
        ordering = ['-uploaded_at']
        
    def __str__(self):
        return f"Document: {self.file_name} for {self.client.client_name}"

class ClientPolicy(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('cancelled', 'Cancelled'),
        ('pending', 'Pending'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    policy_number = models.CharField(max_length=100, unique=True)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='policies', null=True, blank=True, default=None)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    policy_type = models.CharField(max_length=100)
    cover_type = models.CharField(max_length=100, blank=True, null=True)
    vehicle_details = models.JSONField(default=dict, blank=True, null=True)
    premium_amount = models.DecimalField(max_digits=12, decimal_places=2)
    premium_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    start_date = models.DateField()
    expiry_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    agent = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'client_policies'
    
    def __str__(self):
        return f"Policy {self.policy_number} - {self.client.client_name}"
