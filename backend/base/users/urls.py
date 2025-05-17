from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthViewSet, google_callback, google_login  # Ensure these are correctly imported
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r"auth", AuthViewSet, basename="auth")

urlpatterns = [
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/google/login/", google_login, name="google-login"),  # Ensure this view exists
    path("auth/google/callback/", google_callback, name="google-callback"),
    path("", include(router.urls)),
]
