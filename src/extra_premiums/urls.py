from django.urls import path
from . import views

urlpatterns = [
    path('', views.extra_premium_list, name='extra_premium_list'),
    path('bulk-import/', views.bulk_import_extra_premiums, name='bulk_import_extra_premiums'),
    path('<uuid:id>/', views.extra_premium_detail, name='extra_premium_detail'),
]
