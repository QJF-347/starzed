from django.urls import path
from . import views

urlpatterns = [
    path('', views.blog_list, name='blog_list'),
    path('create/', views.blog_create, name='blog_create'),
    path('featured/list/', views.featured_blogs_list, name='featured_blogs_list'),
    path('category/<str:category>/', views.blogs_by_category, name='blogs_by_category'),
    path('<str:id>/', views.blog_detail, name='blog_detail'),
    path('<str:id>/update/', views.blog_update, name='blog_update'),
    path('<str:id>/delete/', views.blog_delete, name='blog_delete'),
]
