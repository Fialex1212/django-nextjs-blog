from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, CommentViewSet

router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='post')
router.register(r'posts/(?P<post_id>[^/.]+)/comments', CommentViewSet, basename='post-comments')

urlpatterns = []

urlpatterns += router.urls