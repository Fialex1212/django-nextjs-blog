from django.urls import path
from .views import (
    PostListView,
    PostDetailView,
    PostCreateView,
    CommentDetailView,
    CommentListView
)

urlpatterns = [
    path('posts/', PostListView.as_view(), name="posts-list"),
    path('post/<str:id>/', PostDetailView.as_view(), name="post-detail"),
    path('posts/create/', PostCreateView.as_view(), name='post-create'),


    path('posts/<uuid:post_id>/comments/', CommentListView.as_view(), name='comment-list'),
    path('comment/<str:id>/', CommentDetailView.as_view(), name="comment-detail"),
]
