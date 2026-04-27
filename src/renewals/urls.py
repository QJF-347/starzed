from django.urls import path
from . import views

urlpatterns = [
    path('', views.renewal_list, name='renewal_list'),
    path('bulk-import/', views.bulk_import_renewals, name='bulk_import_renewals'),
    path('<uuid:id>/', views.renewal_detail, name='renewal_detail'),
]
