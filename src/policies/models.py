from django.db import models
import uuid
from products.models import Product
from companies.models import Company

class Policy(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=200)
    image = models.ImageField(upload_to='policy_images/', blank=True, null=True)
    image_url = models.URLField(max_length=500, blank=True, null=True)
    link = models.CharField(max_length=500)
    path = models.CharField(max_length=500, unique=True, blank=True, null=True)  # Auto-generated path
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'policies'
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        # Auto-generate path from title if not provided
        if not self.path:
            import re
            # Convert title to lowercase, replace spaces with hyphens, remove special chars
            path = re.sub(r'[^\w\s-]', '', self.title.lower())
            path = re.sub(r'[-\s]+', '-', path)
            base_path = path

            # Ensure path is unique
            suffix = 1
            while Policy.objects.filter(path=path).exclude(pk=self.pk).exists():
                suffix += 1
                path = f"{base_path}-{suffix}"

            self.path = path
        
        super().save(*args, **kwargs)

class CompanyPlan(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    branded_name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    features = models.JSONField(default=list)
    benefits = models.JSONField(default=list)
    coverage = models.TextField(blank=True, null=True)
    premium = models.CharField(max_length=100, blank=True, null=True)
    image = models.CharField(max_length=500, blank=True, null=True)
    popular = models.BooleanField(default=False)
    active = models.BooleanField(default=True)
    eligibility = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'company_plans'
        unique_together = ['company', 'product']
    
    def __str__(self):
        return f"{self.company.name} - {self.branded_name}"
