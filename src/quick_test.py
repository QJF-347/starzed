#!/usr/bin/env python
"""
Quick test to check if database tables exist and API works
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'starzed_backend.settings')
django.setup()

print("=== Quick Database Test ===")

try:
    # Test database connection
    from django.db import connection
    with connection.cursor() as cursor:
        cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        tables = [row[0] for row in cursor.fetchall()]
        print(f"Tables in database: {tables}")
        
        if 'clients_client' not in tables:
            print("ERROR: clients_client table does not exist!")
            print("Running migrations...")
            from django.core.management import execute_from_command_line
            execute_from_command_line(['manage.py', 'migrate', '--verbosity=2'])
        else:
            print("clients_client table exists")
            
            # Test if we can access the model
            from clients.models import Client
            count = Client.objects.count()
            print(f"Client count: {count}")
            
            # Test API view
            from clients.views import ClientList
            print("ClientList view: OK")
            
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()

print("=== Test Complete ===")
