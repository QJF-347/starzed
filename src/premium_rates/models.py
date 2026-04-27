import uuid
from django.db import models


class InsurerPremiumRate(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    insurer_name = models.CharField(max_length=200)
    category = models.CharField(max_length=200)
    rate = models.DecimalField(max_digits=10, decimal_places=4, default=0)
    description = models.TextField(blank=True, null=True)
    effective_from = models.DateField(blank=True, null=True)
    effective_to = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=20, default='Active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'insurer_premium_rates'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.insurer_name} - {self.category}"
