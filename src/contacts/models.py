from django.db import models
import uuid

STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('responded', 'Responded'),
    ('closed', 'Closed'),
]

class Contact(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    recipient_email = models.EmailField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'contacts'
    
    def __str__(self):
        return f"Contact from {self.name} - {self.subject}"
