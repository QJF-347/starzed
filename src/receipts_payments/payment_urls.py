from django.urls import path
from . import views

urlpatterns = [
    path('generate-link/', views.generate_payment_link, name='generate_payment_link'),
    path('send-link-email/', views.send_link_email, name='send_link_email'),
    path('validate-link/<str:token>/', views.lookup_payment_link, name='lookup_payment_link'),
    path('initiate/', views.mpesa_initiate_payment, name='mpesa_initiate'),
    path('status/<str:transaction_id>/', views.mpesa_payment_status, name='mpesa_status'),
    path('mpesa-callback/', views.mpesa_callback, name='mpesa_callback'),
    path('receipt/by-transaction/<str:transaction_id>/', views.receipt_by_transaction, name='receipt_by_transaction'),
    path('receipt/<uuid:receipt_id>/download/', views.download_receipt, name='download_receipt'),
    path('debug-config/', views.mpesa_debug_config, name='mpesa_debug_config'),
    path('debug-test-auth/', views.mpesa_debug_test_auth, name='mpesa_debug_test_auth'),
]
