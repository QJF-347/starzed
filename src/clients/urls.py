from django.urls import path
from . import views

urlpatterns = [
    path('', views.client_list, name='client_list'),
    path('search/', views.client_search, name='client_search'),
    path('bulk-import/', views.bulk_import, name='bulk_import'),
    path('policies/', views.policy_list, name='policy_list_global'),
    path('policies/bulk-import/', views.bulk_import_policies, name='bulk_import_policies'),
    path('<uuid:id>/', views.client_detail, name='client_detail'),
    path('<uuid:client_id>/policies/', views.client_policy_list, name='client_policy_list'),
    path('<uuid:client_id>/documents/', views.client_documents_list, name='client_documents_list'),
]
