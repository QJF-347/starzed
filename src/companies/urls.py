from django.urls import path
from . import views

urlpatterns = [
    path('', views.company_list, name='company_list'),
    path('bulk-import/', views.bulk_import_companies, name='bulk_import_companies'),
    path('<uuid:id>/', views.company_detail, name='company_detail'),
    path('<uuid:company_id>/reviews/', views.company_review_list, name='company_review_list'),
    path('<uuid:company_id>/products/', views.company_products, name='company_products'),
]
