from django.urls import path
from . import views

urlpatterns = [
    path('', views.premium_rate_list, name='premium_rate_list'),
    path('bulk-import/', views.bulk_import_premium_rates, name='bulk_import_premium_rates'),
    path('<uuid:id>/', views.premium_rate_detail, name='premium_rate_detail'),
]
