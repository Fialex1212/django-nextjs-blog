from django.shortcuts import render
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from blog.models import Post
from users.models import CustomUser
from blog.serializers import PostSerializer
from users.serializers import UserSerializer


class GlobalSearchViewSet(ViewSet):
    def list(self, request):
        query = request.GET.get("search", "").strip().lower()
        if not query:
            return Response(
                {"error": "Search query is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        users = CustomUser.objects.filter(Q(username__icontains=query))
        users_data = UserSerializer(users, many=True, context={"request": request}).data

        posts = Post.objects.filter(Q(text__icontains=query))
        posts_data = PostSerializer(posts, many=True, context={"request": request}).data

        return Response(
            {"users": users_data, "posts": posts_data}, status=status.HTTP_200_OK
        )
