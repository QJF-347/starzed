#!/usr/bin/env python3
"""
Simple health check script for debugging
"""
import sys
import os

# Add src to path
sys.path.insert(0, '/opt/render/project/src')

try:
    # Try importing Django
    import django
    from django.conf import settings
    
    # Configure Django settings
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'starzed_backend.settings')
    django.setup()
    
    # Check if Django is configured
    print(f"Django version: {django.get_version()}")
    print(f"DEBUG mode: {settings.DEBUG}")
    print(f"Database engine: {settings.DATABASES['default']['ENGINE']}")
    print(f"Allowed hosts: {settings.ALLOWED_HOSTS}")
    
    # Try a simple database connection
    from django.db import connection
    with connection.cursor() as cursor:
        cursor.execute("SELECT 1")
        result = cursor.fetchone()
        print(f"Database connection: OK (result: {result})")
    
    print("Health check: PASSED")
    sys.exit(0)
    
except Exception as e:
    print(f"Health check: FAILED - {str(e)}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
