from django.db import models
import uuid

STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('contacted', 'Contacted'),
    ('quoted', 'Quoted'),
    ('closed', 'Closed'),
]

class Quote(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    product = models.CharField(max_length=200)
    coverage = models.TextField()
    message = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'quotes'
    
    def __str__(self):
        return f"Quote by {self.first_name} {self.last_name} - {self.product}"
