from django.http import JsonResponse
from django.db import connection
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

@csrf_exempt
@require_http_methods(["GET", "POST"])
def fix_eligibility_raw(request):
    """
    Direct SQL fix for eligibility field without using Django ORM
    """
    try:
        with connection.cursor() as cursor:
            # Check if column exists
            cursor.execute("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'generic_products' 
                AND column_name = 'eligibility'
            """)
            
            if cursor.fetchone():
                return JsonResponse({
                    'success': True,
                    'message': 'Eligibility column already exists'
                })
            
            # Add the column
            cursor.execute("""
                ALTER TABLE generic_products 
                ADD COLUMN eligibility JSONB DEFAULT '{}'::jsonb
            """)
            
            return JsonResponse({
                'success': True,
                'message': 'Eligibility field added successfully'
            })
            
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Error: {str(e)}'
        }, status=500)
