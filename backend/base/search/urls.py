from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GlobalSearchViewSet

router = DefaultRouter()
router.register(r"search", GlobalSearchViewSet, basename="global-search")

urlpatterns = [
    path("", include(router.urls)),
]
