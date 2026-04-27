from django.db import models

class Blog(models.Model):
    id = models.CharField(primary_key=True, max_length=50)
    title = models.CharField(max_length=200)
    excerpt = models.TextField()
    content = models.TextField()
    author = models.CharField(max_length=100)
    blog_date = models.CharField(max_length=50)
    read_time = models.CharField(max_length=20)
    category = models.CharField(max_length=100)
    image = models.CharField(max_length=500)
    tags = models.JSONField(default=list)
    featured = models.BooleanField(default=False)
    published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'blogs'
    
    def __str__(self):
        return self.title
