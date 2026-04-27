from django.urls import path
from . import views

urlpatterns = [
    path('', views.activity_list, name='activity_list'),
    path('bulk-import/', views.bulk_import_activities, name='bulk_import_activities'),
    path('<uuid:id>/', views.activity_detail, name='activity_detail'),
]
