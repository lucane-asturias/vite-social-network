from django.urls import path

from . import api

urlpatterns = [
    path('', api.post_list, name='post_list'),
    path('create/', api.post_create, name='post_create'),
    path('<uuid:pk>/', api.post_detail, name='post_detail'),
    path('profile/<uuid:id>/', api.post_list_profile, name='post_list_profile'),
    path('<uuid:pk>/like/', api.post_increment_like, name='post_increment_like'),
    path('<uuid:pk>/comment/', api.post_create_comment, name='post_create_comment')
]