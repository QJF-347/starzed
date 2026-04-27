from django.urls import path
from . import views

urlpatterns = [
    path('', views.file_list, name='file_list'),
    path('bulk-import/', views.bulk_import_files, name='bulk_import_files'),
    path('<uuid:id>/', views.file_detail, name='file_detail'),
]
