from rest_framework import viewsets, status
from .models import Comment, CommentLike
from .serializers import CommentSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
import logging

logger = logging.getLogger("comments")


# Create your views here.
@extend_schema(tags=["Comments"])
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def get_queryset(self):
        """
        Return a single comment if `pk` is provided.
        Otherwise, return all comments (not filtered by post_id).
        """
        return Comment.objects.all()

    def retrieve(self, request, pk=None):
        """
        Get a comment by comment_id (pk).
        """
        try:
            comment = Comment.objects.get(id=pk)
        except Comment.DoesNotExist:
            return Response(
                {"error": "Comment not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = CommentSerializer(comment, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

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
