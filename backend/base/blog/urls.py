from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, CommentViewSet

router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='post')
router.register(r'posts/(?P<post_id>[^/.]+)/comments', CommentViewSet, basename='post-comments')

urlpatterns = [
    path('comments/<uuid:pk>/delete/', CommentViewSet.as_view({'delete': 'delete'}), name='comment-delete'),
    path('comments/<uuid:pk>/like/', CommentViewSet.as_view({'post': 'like'}), name='comment-like'),
    path('comments/<uuid:pk>/update/', CommentViewSet.as_view({'put': 'update'}), name='comment-like'),
] + router.urls