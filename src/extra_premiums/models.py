import uuid
from django.db import models


class ExtraPremium(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    policy_number = models.CharField(max_length=100, blank=True)
    description = models.CharField(max_length=500)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    premium_type = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Extra Premium'
        verbose_name_plural = 'Extra Premiums'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.description} - {self.amount}"
