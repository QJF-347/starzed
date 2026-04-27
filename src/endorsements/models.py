import uuid
from django.db import models


class Endorsement(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    policy_number = models.CharField(max_length=100)
    client_name = models.CharField(max_length=200)
    product = models.CharField(max_length=200, blank=True, null=True)
    insurer = models.CharField(max_length=200, blank=True, null=True)
    endorsement_type = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    effective_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=50, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'endorsements'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.policy_number} - {self.endorsement_type}"
