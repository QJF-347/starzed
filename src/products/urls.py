from django.urls import path
from . import views

from . import views_raw

urlpatterns = [
    path('', views.product_list, name='product_list'),
    path('bulk-import/', views.bulk_import_products, name='bulk_import_products'),
    path('create/', views.product_create, name='product_create'),
    path('fix-eligibility/', views.fix_eligibility_field, name='fix_eligibility_field'),
    path('fix-raw/', views_raw.fix_eligibility_raw, name='fix_eligibility_raw'),
    path('<str:id>/', views.product_detail, name='product_detail'),
    path('<str:id>/update/', views.product_update, name='product_update'),
    path('<str:id>/delete/', views.product_delete, name='product_delete'),
]
