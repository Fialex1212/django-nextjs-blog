from rest_framework.response import Response
from rest_framework import filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.viewsets import ViewSet
from .serializers import RegisterSerializer, UserSerializer
from rest_framework.decorators import action
from .models import CustomUser
from django.shortcuts import get_object_or_404


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


class AuthViewSet(ViewSet):
    filter_backends = filters.SearchFilter
    search_fields = ["username"]

    @action(detail=False, methods=["post"])
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(get_tokens_for_user(user), status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"])
    def login(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user:
            return Response(get_tokens_for_user(user))
        return Response(
            {"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    @permission_classes([IsAuthenticated])
    def me(self, request):
        return Response(UserSerializer(request.user).data)

    @action(detail=False, methods=["get"])
    def user_detail(self, request):

        username = request.query_params.get("username")
        if not username:
            return Response(
                {"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST
            )
        user = get_object_or_404(CustomUser, username=username)
        if user:
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"error": "User not found"}, status=status.HTTP_404_BAD_REQUEST)
