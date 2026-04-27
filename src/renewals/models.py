import uuid
from django.db import models


class Renewal(models.Model):
    CATEGORY_CHOICES = [
        ('motor', 'Motor'),
        ('medical', 'Accidental and Medical'),
        ('non_motor', 'Non-Motor'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='motor')
    policy_number = models.CharField(max_length=100, blank=True, null=True)
    client_name = models.CharField(max_length=200, blank=True, null=True)
    product = models.CharField(max_length=200, blank=True, null=True)
    insurer = models.CharField(max_length=200, blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    expiry_date = models.DateField(blank=True, null=True)
    premium = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=50, default='Pending')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'renewals'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.policy_number} - {self.client_name}"
