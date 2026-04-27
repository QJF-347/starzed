import uuid
from django.db import models


class Certificate(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('pending', 'Pending'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    certificate_no = models.CharField(max_length=100, unique=True)
    insurer = models.CharField(max_length=200, blank=True, null=True)
    date = models.DateField(blank=True, null=True)
    user_name = models.CharField(max_length=200, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    item = models.CharField(max_length=255, blank=True, null=True)
    d_expiry = models.DateField(blank=True, null=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'certificates'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.certificate_no} - {self.insurer}"


class CertificateIssue(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client_name = models.CharField(max_length=200)
    policy_number = models.CharField(max_length=100, blank=True, null=True)
    vehicle_item = models.CharField(max_length=255, blank=True, null=True)
    amount_paid = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    certificate_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    certificate_no = models.CharField(max_length=100, unique=True)
    date_from = models.DateField(blank=True, null=True)
    expiry_date = models.DateField(blank=True, null=True)
    no_of_months = models.IntegerField(default=12)
    remarks = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'certificate_issues'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.certificate_no} - {self.client_name}"


class CertificateDeclaration(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    certificate_no = models.CharField(max_length=100)
    client_name = models.CharField(max_length=200)
    insurer = models.CharField(max_length=200, blank=True, null=True)
    declaration_text = models.TextField(blank=True, null=True)
    signed_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'certificate_declarations'
        ordering = ['-created_at']

    def __str__(self):
        return f"Declaration - {self.certificate_no}"
