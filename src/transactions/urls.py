from django.urls import path
from . import views

urlpatterns = [
    path('', views.transaction_list, name='transaction_list'),
    path('bulk-import/', views.bulk_import_transactions, name='bulk_import_transactions'),
    path('<uuid:id>/', views.transaction_detail, name='transaction_detail'),
    path('extra-premiums/', views.extra_premium_list, name='extra_premium_list'),
    path('extra-premiums/<uuid:id>/', views.extra_premium_detail, name='extra_premium_detail'),
]
