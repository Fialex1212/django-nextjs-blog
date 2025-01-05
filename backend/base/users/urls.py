from django.urls import path
from .views import (
    RegisterView,
    VerifyEmailView,
    LoginView,
    LogoutView,

    UserListCreateView,
    ProfileView,
    RefreshTokenView,
    CheckAuthStatus
)

urlpatterns = [
    #Login/Register
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('register/', RegisterView.as_view(), name='register'),
    path('register/verify/', VerifyEmailView.as_view(), name="verify_email"),

    #User info
    path('list/', UserListCreateView.as_view(), name='get_users'),
    path('profile/', ProfileView.as_view(), name='user_profile'),
    path('refresh-token/', RefreshTokenView.as_view(), name='refresh_token'),
    path('check-auth-status/', CheckAuthStatus.as_view(), name='check_auth_status')
]