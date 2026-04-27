from django.urls import path
from . import views

urlpatterns = [
    path('', views.endorsement_list, name='endorsement_list'),
    path('bulk-import/', views.bulk_import_endorsements, name='bulk_import_endorsements'),
    path('<uuid:id>/', views.endorsement_detail, name='endorsement_detail'),
]
