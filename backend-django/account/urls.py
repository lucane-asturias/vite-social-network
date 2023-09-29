from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import api

urlpatterns = [
    path('me/', api.me, name='me'),
    path('signup/', api.signup, name='signup'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('friends/<uuid:pk>/', api.friends, name='friends'),
    path('friends/<uuid:pk>/request/', api.send_friendship_request, name='send_friendship_request'),
    path('friends/<uuid:pk>/<str:status>/', api.handle_friendship_request, name='handle_friendship_request'), 
    path('friends/suggestions/', api.my_friendship_suggestions, name='my_friendship_suggestions'),
    path('editprofile/', api.edit_profile, name='edit_profile'), 
    path('editpassword/', api.edit_password, name='edit_password'), 
]