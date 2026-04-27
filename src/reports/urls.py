from django.urls import path
from . import views

urlpatterns = [
    path('', views.report_list, name='report_list'),
    path('bulk-import/', views.bulk_import_reports, name='bulk_import_reports'),
    path('<uuid:id>/', views.report_detail, name='report_detail'),
]
