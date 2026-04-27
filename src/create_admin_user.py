#!/usr/bin/env python3
"""
Simple script to create admin user for Render deployment.
This script is designed to run after migrations.
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'starzed_backend.settings')
try:
    django.setup()
except Exception as e:
    print(f"Error setting up Django: {e}")
    sys.exit(1)

from django.contrib.auth import get_user_model

User = get_user_model()

def create_admin_user():
    """Create admin user if it doesn't exist"""
    try:
        # Check if admin user already exists
        if User.objects.filter(email='admin@starzed.com').exists():
            print("Admin user already exists")
            admin_user = User.objects.get(email='admin@starzed.com')
            print(f"Email: {admin_user.email}")
            print(f"Active: {admin_user.is_active}")
            print(f"Superuser: {admin_user.is_superuser}")
            return True

        # Create admin user
        print("Creating admin user...")
        admin_user = User.objects.create_user(
            username='admin',  # Add username field
            email='admin@starzed.com',
            first_name='Admin',
            last_name='User',
            password='admin123'
        )
        admin_user.is_superuser = True
        admin_user.is_staff = True
        admin_user.is_active = True
        admin_user.role = 'admin'
        admin_user.save()

        print("Admin user created successfully!")
        print("Credentials:")
        print(f"  Email: admin@starzed.com")
        print(f"  Password: admin123")
        return True

    except Exception as e:
        print(f"Error creating admin user: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("="*60)
    print("Creating Admin User for Starzed Application")
    print("="*60)

    success = create_admin_user()

    print("="*60)
    if success:
        print("SUCCESS: Admin user setup completed")
    else:
        print("WARNING: Admin user setup had issues")
    print("="*60)