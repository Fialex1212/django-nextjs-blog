from rest_framework import viewsets, status
from rest_framework import filters
from .models import Post, PostLike, Comment, CommentLike
from .serializers import PostSerializer, CommentSerializer
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound
import logging

logger = logging.getLogger("blog")


class PostPagination(PageNumberPagination):
    page_size = 3
    page_size_query_param = "limit"
    max_page_size = 100


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    pagination_class = PostPagination
    filter_backends = (filters.SearchFilter,)
    search_fields = ["text"]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        user = request.user
        if not user.is_authenticated:
            return Response(
                {"error": "Authentication required"},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        try:
            post = Post.objects.get(id=pk)
        except Post.DoesNotExist:
            return Response(
                {"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND
            )

        like, create = PostLike.objects.get_or_create(user=user, post=post)

        if not create:
            like.delete()
            return Response({"message": "Like removed"}, status=status.HTTP_200_OK)

        return Response(
            {
                "message": "Post liked",
                "post": PostSerializer(post, context={"request": request}).data,
            },
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["put"], permission_classes=[IsAuthenticated])
    def update_post(self, request, pk=None):
        user = request.user

        try:
            post = Post.objects.get(id=pk)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

        if user != post.author:
            return Response({"error": "You are not the author of this post"}, status=status.HTTP_403_FORBIDDEN)

        serializer = PostSerializer(post, data=request.data, partial=True, context={"request": request})
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=["delete"], permission_classes=[IsAuthenticated])
    def delete_post(self, request, pk=None):
        user = request.user

        try:
            post = Post.objects.get(id=pk)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

        if user != post.author:
            return Response({"error": "You are not the author of this post"}, status=status.HTTP_403_FORBIDDEN)

       
        post.delete()

        return Response({"message": f"Post {pk} was deleted"}, status=status.HTTP_200_OK)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def get_queryset(self):

        post_id = self.kwargs.get('post_id')
        print(f"post_id from URL: {post_id}")
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            raise NotFound(detail="Post not found.")
        return Comment.objects.filter(post=post)
    
    def create(self, request, *args, **kwargs):

        post_id = self.kwargs.get("post_id")

        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Добавляем post в данные запроса для сериализатора
        request.data["post"] = post.id
        
        return super().create(request, *args, **kwargs)
    
    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        user = request.user
        if not user.is_authenticated:
            return Response(
                {"error": "Authentication required"},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        try:
            comment = Comment.objects.get(id=pk)
        except Comment.DoesNotExist:
            return Response(
                {"error": "Comment not found"}, status=status.HTTP_404_NOT_FOUND
            )

        like, create = CommentLike.objects.get_or_create(user=user, comment=comment)

        if not create:
            like.delete()
            return Response({"message": "Like removed"}, status=status.HTTP_200_OK)

        return Response(
            {
                "message": "Comment liked",
                "post": CommentSerializer(comment, context={"request": request}).data,
            },
            status=status.HTTP_201_CREATED,
        )
        
    @action(detail=True, methods=["delete"], permission_classes=[IsAuthenticated])
    def delete(self, request, pk=None):
        user = request.user

        try:
            comment = Comment.objects.get(id=pk)
        except Comment.DoesNotExist:
            return Response({"error": "Comment not found"}, status=status.HTTP_404_NOT_FOUND)

        if user != comment.author:
            return Response({"error": "You are not the author of this Comment"}, status=status.HTTP_403_FORBIDDEN)

       
        comment.delete()

        return Response({"message": f"Comment {pk} was deleted"}, status=status.HTTP_200_OK)
