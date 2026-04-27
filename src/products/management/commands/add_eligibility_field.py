from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Add eligibility field to products table if it does not exist'

    def handle(self, *args, **options):
        with connection.cursor() as cursor:
            # Check if the column exists
            cursor.execute("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'generic_products' 
                AND column_name = 'eligibility'
            """)
            
            if cursor.fetchone():
                self.stdout.write(self.style.SUCCESS('Eligibility column already exists'))
            else:
                # Add the column
                cursor.execute("""
                    ALTER TABLE generic_products 
                    ADD COLUMN eligibility JSONB DEFAULT '{}'::jsonb
                """)
                self.stdout.write(self.style.SUCCESS('Eligibility column added successfully'))
