import uuid
from django.db import models


class CustomerReceipt(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    receipt_no = models.CharField(max_length=100, unique=True)
    client_name = models.CharField(max_length=200)
    policy_number = models.CharField(max_length=100, blank=True, null=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    payment_method = models.CharField(max_length=100, blank=True, null=True)
    receipt_date = models.DateField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'customer_receipts'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.receipt_no} - {self.client_name}"


class InsurerPayment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    payment_no = models.CharField(max_length=100, unique=True)
    insurer_name = models.CharField(max_length=200)
    policy_number = models.CharField(max_length=100, blank=True, null=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    payment_method = models.CharField(max_length=100, blank=True, null=True)
    payment_date = models.DateField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'insurer_payments'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.payment_no} - {self.insurer_name}"


class Premium(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    premium_no = models.CharField(max_length=100, unique=True)
    client_name = models.CharField(max_length=200)
    policy_number = models.CharField(max_length=100, blank=True, null=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    premium_type = models.CharField(max_length=100, blank=True, null=True)
    due_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=50, default='Pending')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'premiums'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.premium_no} - {self.client_name}"


class PremiumPaymentLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    log_no = models.CharField(max_length=100, unique=True)
    client_name = models.CharField(max_length=200)
    policy_number = models.CharField(max_length=100, blank=True, null=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    payment_method = models.CharField(max_length=100, blank=True, null=True)
    payment_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=50, default='Completed')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'premium_payment_logs'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.log_no} - {self.client_name}"


class PaymentLink(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client_name = models.CharField(max_length=200)
    policy_number = models.CharField(max_length=100, blank=True, null=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    link_url = models.URLField(blank=True, null=True)
    status = models.CharField(max_length=50, default='Active')
    expires_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    meta = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = 'payment_links'
        ordering = ['-created_at']

    def __str__(self):
        return f"Link - {self.client_name} - {self.amount}"
