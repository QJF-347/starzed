from django.core.management.base import BaseCommand
from django.db import connection
from django.apps import apps
import time


class Command(BaseCommand):
    help = 'Check Django setup and database connectivity'

    def handle(self, *args, **options):
        self.stdout.write("=== Django Setup Check ===")
        
        # Check database connection
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                self.stdout.write(self.style.SUCCESS("Database connection: OK"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Database connection failed: {e}"))
            return

        # Check apps and models
        app_configs = ['users', 'clients', 'products', 'blogs', 'policies', 'companies', 'quotes', 'contacts']
        
        for app_name in app_configs:
            try:
                app_config = apps.get_app_config(app_name)
                model_names = [model.__name__ for model in app_config.get_models()]
                self.stdout.write(self.style.SUCCESS(f"App '{app_name}': {len(model_names)} models"))
                
                # Check if models have tables
                for model in app_config.get_models():
                    try:
                        model.objects.count()
                        self.stdout.write(f"  - {model.__name__}: Table exists")
                    except Exception as e:
                        self.stdout.write(self.style.WARNING(f"  - {model.__name__}: Table issue - {e}"))
                        
            except LookupError:
                self.stdout.write(self.style.WARNING(f"App '{app_name}': Not found"))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"App '{app_name}': Error - {e}"))

        # Check URL routes
        try:
            from django.urls import reverse
            from django.test import Client
            
            # Test some basic endpoints
            test_urls = [
                '/api/health/',
                '/api/users/',
                '/api/products/',
                '/api/blogs/',
                '/api/policies/',
            ]
            
            client = Client()
            
            for url in test_urls:
                try:
                    response = client.get(url)
                    status = "OK" if response.status_code == 200 else f"HTTP {response.status_code}"
                    self.stdout.write(f"URL {url}: {status}")
                except Exception as e:
                    self.stdout.write(self.style.WARNING(f"URL {url}: Error - {e}"))
                    
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"URL testing failed: {e}"))

        self.stdout.write("=== Check Complete ===")
