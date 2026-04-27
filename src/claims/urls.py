from django.urls import path

from . import views


urlpatterns = [
    path('', views.claim_list, name='claim_list'),
    path('bulk-import/', views.bulk_import_claims, name='bulk_import_claims'),
    path('<uuid:id>/', views.claim_detail, name='claim_detail'),
]
