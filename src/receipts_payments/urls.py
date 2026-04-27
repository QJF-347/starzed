from django.urls import path
from . import views

urlpatterns = [
    path('receipts/', views.receipt_list, name='receipt_list'),
    path('receipts/bulk-import/', views.bulk_import_receipts, name='bulk_import_receipts'),
    path('receipts/<uuid:id>/', views.receipt_detail, name='receipt_detail'),
    path('insurer-payments/', views.insurer_payment_list, name='insurer_payment_list'),
    path('insurer-payments/<uuid:id>/', views.insurer_payment_detail, name='insurer_payment_detail'),
    path('premiums/', views.premium_list, name='premium_list'),
    path('premiums/<uuid:id>/', views.premium_detail, name='premium_detail'),
    path('premium-payment-logs/', views.premium_payment_log_list, name='premium_payment_log_list'),
    path('premium-payment-logs/<uuid:id>/', views.premium_payment_log_detail, name='premium_payment_log_detail'),
    path('payment-links/', views.payment_link_list, name='payment_link_list'),
    path('payment-links/<uuid:id>/', views.payment_link_detail, name='payment_link_detail'),
]
