import uuid
from django.db import models


class Cover(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cover_category = models.CharField(max_length=200)
    client_name = models.CharField(max_length=200, blank=True, null=True)
    policy_number = models.CharField(max_length=100, blank=True, null=True)
    insurer = models.CharField(max_length=200, blank=True, null=True)
    product = models.CharField(max_length=200, blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    expiry_date = models.DateField(blank=True, null=True)
    premium = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=50, default='Active')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'covers'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.cover_category} - {self.client_name}"
