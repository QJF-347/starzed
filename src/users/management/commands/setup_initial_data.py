from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from products.models import Product
from blogs.models import Blog
from companies.models import Company
from policies.models import Policy
from clients.models import Client, ClientPolicy
from datetime import date, timedelta

User = get_user_model()

class Command(BaseCommand):
    help = 'Create initial data for the application'

    def handle(self, *args, **options):
        # Create admin user - with error handling for missing columns
        try:
            if not User.objects.filter(email='admin@starzed.com').exists():
                # Use create_user instead of create_superuser to avoid issues with missing fields
                admin_user = User.objects.create_user(
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
            else:
                self.stdout.write(self.style.WARNING('Admin user already exists'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error creating admin user: {e}'))
            self.stdout.write(self.style.WARNING('Skipping admin user creation - table may not be fully migrated'))

        # Create sample products
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

        for product_data in products_data:
            Product.objects.get_or_create(
                id=product_data['id'],
                defaults=product_data
            )
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(products_data)} products'))

        # Create sample blogs
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

        for blog_data in blogs_data:
            Blog.objects.get_or_create(
                id=blog_data['id'],
                defaults=blog_data
            )
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(blogs_data)} blogs'))

        # Create sample companies
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

        for company_data in companies_data:
            Company.objects.get_or_create(
                name=company_data['name'],
                defaults=company_data
            )
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(companies_data)} companies'))

        # Create sample policies
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

        for policy_data in policies_data:
            Policy.objects.get_or_create(
                title=policy_data['title'],
                defaults=policy_data
            )
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(policies_data)} policies'))

        # Create sample clients
        clients_data = [
            {
                'client_name': 'John Doe',
                'business_name': 'Doe Enterprises',
                'id_number': '12345678',
                'mobile': '0712345678',
                'email': 'john.doe@example.com',
                'address': '123 Kenyatta Avenue, Nairobi',
                'town': 'Nairobi',
                'kra_pin': 'P000000001Z',
            },
            {
                'client_name': 'Jane Smith',
                'business_name': 'Smith Holdings',
                'id_number': '87654321',
                'mobile': '0723456789',
                'email': 'jane.smith@example.com',
                'address': '456 Moi Avenue, Nairobi',
                'town': 'Nairobi',
                'kra_pin': 'P000000002Z',
            },
        ]

        created_clients = []
        for client_data in clients_data:
            client, created = Client.objects.get_or_create(
                id_number=client_data['id_number'],
                defaults=client_data
            )
            created_clients.append(client)

        self.stdout.write(self.style.SUCCESS(f'Created/verified {len(created_clients)} clients'))

        # Create sample client policies
        motor_product = Product.objects.filter(id='motor-insurance').first()
        health_product = Product.objects.filter(id='health-insurance').first()

        if created_clients and motor_product:
            client_policies_data = [
                {
                    'policy_number': 'POL-2026-001',
                    'client': created_clients[0],
                    'product': motor_product,
                    'policy_type': 'Comprehensive',
                    'premium_amount': 45000.00,
                    'start_date': date.today(),
                    'expiry_date': date.today() + timedelta(days=365),
                    'status': 'active',
                },
                {
                    'policy_number': 'POL-2026-002',
                    'client': created_clients[1],
                    'product': motor_product,
                    'policy_type': 'Third Party',
                    'premium_amount': 15000.00,
                    'start_date': date.today(),
                    'expiry_date': date.today() + timedelta(days=365),
                    'status': 'active',
                },
            ]

            # Also create a health policy for first client if health product exists
            if health_product:
                client_policies_data.append({
                    'policy_number': 'POL-2026-003',
                    'client': created_clients[0],
                    'product': health_product,
                    'policy_type': 'Family Cover',
                    'premium_amount': 36000.00,
                    'start_date': date.today(),
                    'expiry_date': date.today() + timedelta(days=365),
                    'status': 'active',
                })

            for cp_data in client_policies_data:
                ClientPolicy.objects.get_or_create(
                    policy_number=cp_data['policy_number'],
                    defaults=cp_data
                )

            self.stdout.write(self.style.SUCCESS(f'Created {len(client_policies_data)} client policies'))
        else:
            self.stdout.write(self.style.WARNING('Skipping client policy creation - missing required products or clients'))

        self.stdout.write(self.style.SUCCESS('Initial data setup completed successfully!'))
