from django.urls import path

from . import views


urlpatterns = [
    path('', views.insurance_type_list, name='insurance_type_list'),
    path('bulk-import/', views.bulk_import_insurance_types, name='bulk_import_insurance_types'),
    path('<uuid:id>/', views.insurance_type_detail, name='insurance_type_detail'),
]
