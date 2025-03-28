from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, CommentViewSet

router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='post')
router.register(r'posts/(?P<post_id>[^/.]+)/comments', CommentViewSet, basename='post-comments')

urlpatterns = [
    path(
        'blog/posts/<uuid:post_id>/comments/<uuid:pk>/like/',
        CommentViewSet.as_view({'post': 'like'}),
        name='comment-like',
    ),
]

urlpatterns += router.urls