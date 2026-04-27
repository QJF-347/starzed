from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import connection, DatabaseError
from products.models import Product
from blogs.models import Blog
from companies.models import Company
from policies.models import Policy
import sys

User = get_user_model()

class Command(BaseCommand):
    help = 'Create initial data for the application (robust version for PostgreSQL)'

    def check_database_connection(self):
        """Check if database is accessible"""
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
            return True
        except DatabaseError as e:
            self.stdout.write(self.style.ERROR(f'Database connection error: {e}'))
            return False

    def check_table_exists(self, table_name):
        """Check if a table exists in the database"""
        try:
            with connection.cursor() as cursor:
                if connection.vendor == 'postgresql':
                    cursor.execute("""
                        SELECT EXISTS (
                            SELECT FROM information_schema.tables
                            WHERE table_name = %s
                        );
                    """, [table_name])
                    return cursor.fetchone()[0]
                else:  # SQLite
                    cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table_name}';")
                    return cursor.fetchone() is not None
        except Exception as e:
            self.stdout.write(self.style.WARNING(f'Error checking table {table_name}: {e}'))
            return False

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting robust initial data setup...'))

        # Check database connection first
        if not self.check_database_connection():
            self.stdout.write(self.style.ERROR('Cannot connect to database. Aborting.'))
            sys.exit(1)

        # Check if users table exists
        if not self.check_table_exists('users_user'):
            self.stdout.write(self.style.WARNING('Users table does not exist. Skipping user creation.'))
            self.stdout.write(self.style.WARNING('Run migrations first: python manage.py migrate'))
        else:
            # Create admin user - with error handling for missing columns
            try:
                if not User.objects.filter(email='admin@starzed.com').exists():
                    # Use create_user instead of create_superuser to avoid issues with missing fields
                    admin_user = User.objects.create_user(
                        username='admin',  # Add username field
                        email='admin@starzed.com',
                        first_name='Admin',
                        last_name='User',
                        password='admin123'
                    )
                    # Manually set superuser and staff flags
                    admin_user.is_superuser = True
                    admin_user.is_staff = True
                    admin_user.is_active = True
                    admin_user.role = 'admin'
                    admin_user.save()
                    self.stdout.write(self.style.SUCCESS('Admin user created successfully'))
                    self.stdout.write(self.style.SUCCESS('Credentials: admin@starzed.com / admin123'))
                else:
                    self.stdout.write(self.style.WARNING('Admin user already exists'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error creating admin user: {e}'))
                self.stdout.write(self.style.WARNING('Skipping admin user creation - table may not be fully migrated'))

        # Create sample products if table exists
        if self.check_table_exists('products_product'):
            products_data = [
                {
                    'id': 'motor-insurance',
                    'title': 'Motor Insurance',
                    'category': 'Vehicle',
                    'short_description': 'Comprehensive motor insurance coverage',
                    'description': 'Full coverage motor insurance with 24/7 roadside assistance',
                    'features': ['24/7 Roadside Assistance', 'Comprehensive Coverage', 'No Claim Bonus'],
                    'benefits': ['Peace of Mind', 'Financial Protection', 'Legal Compliance'],
                    'coverage': 'Up to KES 5,000,000',
                    'premium': 'From KES 5,000/month',
                    'icon': 'car-icon.png',
                    'image': 'motor-insurance.jpg',
                    'popular': True
                },
                {
                    'id': 'health-insurance',
                    'title': 'Health Insurance',
                    'category': 'Health',
                    'short_description': 'Comprehensive health coverage',
                    'description': 'Complete health insurance for individuals and families',
                    'features': ['Inpatient Coverage', 'Outpatient Coverage', 'Dental Coverage'],
                    'benefits': ['Access to Best Hospitals', 'Cashless Treatment', 'Family Coverage'],
                    'coverage': 'Up to KES 10,000,000',
                    'premium': 'From KES 3,000/month',
                    'icon': 'health-icon.png',
                    'image': 'health-insurance.jpg',
                    'popular': False
                },
                {
                    'id': 'life-insurance',
                    'title': 'Life Insurance',
                    'category': 'Life',
                    'short_description': 'Secure your family\'s future',
                    'description': 'Comprehensive life insurance coverage for your loved ones',
                    'features': ['Death Benefit', 'Critical Illness Cover', 'Disability Cover'],
                    'benefits': ['Financial Security', 'Peace of Mind', 'Tax Benefits'],
                    'coverage': 'Up to KES 20,000,000',
                    'premium': 'From KES 2,000/month',
                    'icon': 'life-icon.png',
                    'image': 'life-insurance.jpg',
                    'popular': True
                }
            ]

            created_count = 0
            for product_data in products_data:
                try:
                    Product.objects.get_or_create(
                        id=product_data['id'],
                        defaults=product_data
                    )
                    created_count += 1
                except Exception as e:
                    self.stdout.write(self.style.WARNING(f'Error creating product {product_data["id"]}: {e}'))

            self.stdout.write(self.style.SUCCESS(f'Created/updated {created_count} products'))
        else:
            self.stdout.write(self.style.WARNING('Products table does not exist. Skipping product creation.'))

        # Create sample blogs if table exists
        if self.check_table_exists('blogs_blog'):
            blogs_data = [
                {
                    'id': 'understanding-insurance',
                    'title': 'Understanding Insurance Basics',
                    'excerpt': 'Learn the fundamentals of insurance',
                    'content': 'Insurance is a financial protection that helps you manage risks. In this comprehensive guide, we\'ll explore the basics of insurance, different types of coverage, and how to choose the right policy for your needs.',
                    'author': 'Admin',
                    'blog_date': 'April 7, 2026',
                    'read_time': '5 min read',
                    'category': 'Education',
                    'image': 'insurance-basics.jpg',
                    'tags': ['insurance', 'education', 'basics'],
                    'featured': True,
                    'published': True
                },
                {
                    'id': 'motor-insurance-guide',
                    'title': 'Complete Guide to Motor Insurance',
                    'excerpt': 'Everything you need to know about car insurance',
                    'content': 'Motor insurance is not just a legal requirement; it\'s essential protection for your vehicle. This guide covers comprehensive coverage, third-party liability, and how to choose the right policy.',
                    'author': 'Admin',
                    'blog_date': 'April 6, 2026',
                    'read_time': '8 min read',
                    'category': 'Motor Insurance',
                    'image': 'motor-guide.jpg',
                    'tags': ['motor', 'insurance', 'guide'],
                    'featured': False,
                    'published': True
                }
            ]

            created_count = 0
            for blog_data in blogs_data:
                try:
                    Blog.objects.get_or_create(
                        id=blog_data['id'],
                        defaults=blog_data
                    )
                    created_count += 1
                except Exception as e:
                    self.stdout.write(self.style.WARNING(f'Error creating blog {blog_data["id"]}: {e}'))

            self.stdout.write(self.style.SUCCESS(f'Created/updated {created_count} blogs'))
        else:
            self.stdout.write(self.style.WARNING('Blogs table does not exist. Skipping blog creation.'))

        # Create sample companies if table exists
        if self.check_table_exists('companies_company'):
            companies_data = [
                {
                    'name': 'Jubilee Insurance',
                    'display_name': 'Jubilee Insurance Kenya',
                    'description': 'Leading insurance company in Kenya with comprehensive coverage options',
                    'logo': 'jubilee-logo.png',
                    'website': 'https://www.jubileeinsurance.com',
                    'contact': {'email': 'info@jubilee.com', 'phone': '+254-711-123-456', 'address': 'Nairobi, Kenya'},
                    'rating': 4.5,
                    'established': 1937,
                    'headquarters': 'Nairobi, Kenya',
                    'licensed': True,
                    'active': True
                },
                {
                    'name': 'UAP Insurance',
                    'display_name': 'UAP Old Mutual',
                    'description': 'Premier insurance provider offering innovative solutions',
                    'logo': 'uap-logo.png',
                    'website': 'https://www.uap.co.ke',
                    'contact': {'email': 'info@uap.co.ke', 'phone': '+254-722-987-654', 'address': 'Nairobi, Kenya'},
                    'rating': 4.3,
                    'established': 1931,
                    'headquarters': 'Nairobi, Kenya',
                    'licensed': True,
                    'active': True
                }
            ]

            created_count = 0
            for company_data in companies_data:
                try:
                    Company.objects.get_or_create(
                        name=company_data['name'],
                        defaults=company_data
                    )
                    created_count += 1
                except Exception as e:
                    self.stdout.write(self.style.WARNING(f'Error creating company {company_data["name"]}: {e}'))

            self.stdout.write(self.style.SUCCESS(f'Created/updated {created_count} companies'))
        else:
            self.stdout.write(self.style.WARNING('Companies table does not exist. Skipping company creation.'))

        # Create sample policies if table exists
        if self.check_table_exists('policies_policy'):
            policies_data = [
                {
                    'title': 'Third Party Motor Insurance',
                    'description': 'Basic motor insurance covering third-party liability',
                    'icon': 'third-party.png',
                    'image': 'third-party-motor.jpg',
                    'link': '/products/motor-insurance'
                },
                {
                    'title': 'Comprehensive Motor Insurance',
                    'description': 'Full coverage motor insurance with additional benefits',
                    'icon': 'comprehensive.png',
                    'image': 'comprehensive-motor.jpg',
                    'link': '/products/motor-insurance'
                }
            ]

            created_count = 0
            for policy_data in policies_data:
                try:
                    Policy.objects.get_or_create(
                        title=policy_data['title'],
                        defaults=policy_data
                    )
                    created_count += 1
                except Exception as e:
                    self.stdout.write(self.style.WARNING(f'Error creating policy {policy_data["title"]}: {e}'))

            self.stdout.write(self.style.SUCCESS(f'Created/updated {created_count} policies'))
        else:
            self.stdout.write(self.style.WARNING('Policies table does not exist. Skipping policy creation.'))

        self.stdout.write(self.style.SUCCESS('Robust initial data setup completed!'))
        self.stdout.write(self.style.SUCCESS('If any tables were missing, run migrations and try again.'))