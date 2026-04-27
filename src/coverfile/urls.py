from django.urls import path
from . import views

urlpatterns = [
    path('', views.cover_list, name='cover_list'),
    path('bulk-import/', views.bulk_import_covers, name='bulk_import_covers'),
    path('<uuid:id>/', views.cover_detail, name='cover_detail'),
]
