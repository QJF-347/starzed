from django.urls import path
from . import views

urlpatterns = [
    path('', views.policy_list, name='policy_list'),
    path('company-plans/', views.company_plan_list, name='company_plan_list'),
    path('company-plans/<uuid:id>/', views.company_plan_detail, name='company_plan_detail'),
    path('<uuid:id>/', views.policy_detail, name='policy_detail'),
]
