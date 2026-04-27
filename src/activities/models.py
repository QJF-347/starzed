import uuid
from django.db import models


class Activity(models.Model):
    TYPE_CHOICES = [
        ('call', 'Call'),
        ('email', 'Email'),
        ('meeting', 'Meeting'),
        ('task', 'Task'),
        ('note', 'Note'),
        ('other', 'Other'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    activity_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='other')
    subject = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    related_to = models.CharField(max_length=100, blank=True, null=True)
    related_id = models.CharField(max_length=100, blank=True, null=True)
    performed_by = models.CharField(max_length=200, blank=True, null=True)
    performed_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'activities'
        ordering = ['-performed_at']

    def __str__(self):
        return f"{self.activity_type}: {self.subject}"
