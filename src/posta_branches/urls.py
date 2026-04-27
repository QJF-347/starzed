from django.urls import path
from . import views

urlpatterns = [
    path('', views.branch_list, name='branch_list'),
    path('bulk-import/', views.bulk_import_branches, name='bulk_import_branches'),
    path('<uuid:id>/', views.branch_detail, name='branch_detail'),
]
