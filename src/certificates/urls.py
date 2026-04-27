from django.urls import path
from . import views

urlpatterns = [
    path('', views.certificate_list, name='certificate_list'),
    path('bulk-import/', views.bulk_import_certificates, name='bulk_import_certificates'),
    path('<uuid:id>/', views.certificate_detail, name='certificate_detail'),
    path('issues/', views.certificate_issue_list, name='certificate_issue_list'),
    path('issues/<uuid:id>/', views.certificate_issue_detail, name='certificate_issue_detail'),
    path('declarations/', views.certificate_declaration_list, name='certificate_declaration_list'),
    path('declarations/<uuid:id>/', views.certificate_declaration_detail, name='certificate_declaration_detail'),
]
