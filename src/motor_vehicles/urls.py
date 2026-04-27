from django.urls import path
from . import views

urlpatterns = [
    path('', views.vehicle_list, name='vehicle_list'),
    path('bulk-import/', views.bulk_import_vehicles, name='bulk_import_vehicles'),
    path('<uuid:id>/', views.vehicle_detail, name='vehicle_detail'),
]
