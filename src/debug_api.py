#!/usr/bin/env python
"""
Debug script to test API endpoints and identify 500 errors
"""
import os
import sys
import django

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'starzed_backend.settings')
django.setup()

print("=== API Debug Test ===")

try:
    from django.test import Client
    from django.urls import reverse
    
    client = Client()
    
    # Test basic API endpoints
    endpoints = [
        '/api/clients/',
        '/api/health/',
        '/api/test/',
    ]
    
    for endpoint in endpoints:
        print(f"\nTesting {endpoint}...")
        try:
            response = client.get(endpoint)
            print(f"Status: {response.status_code}")
            if response.status_code != 200:
                print(f"Content: {response.content.decode()[:500]}")
            else:
                print("SUCCESS!")
        except Exception as e:
            print(f"ERROR: {e}")
    
    # Test database models
    print("\n=== Database Models Test ===")
    try:
        from clients.models import Client
        print("Client model: OK")
        
        # Try to query
        count = Client.objects.count()
        print(f"Client count: {count}")
        
    except Exception as e:
        print(f"Client model error: {e}")
        import traceback
        traceback.print_exc()
    
    print("\n=== Debug Complete ===")
    
except Exception as e:
    print(f"CRITICAL ERROR: {e}")
    import traceback
    traceback.print_exc()
