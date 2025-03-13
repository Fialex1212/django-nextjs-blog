from rest_framework.response import Response
from rest_framework import filters
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.viewsets import ViewSet
from .serializers import RegisterSerializer, UserSerializer, AvatarUpdateSerializer
from rest_framework.decorators import action
from .models import CustomUser
from django.shortcuts import get_object_or_404
from django.http import Http404
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken

import re
from django.db import IntegrityError
from django.core.exceptions import ValidationError
from django.core.validators import EmailValidator


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
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    #Update username
    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated])
    def update_username(self, request):

        username = request.query_params.get("username")
        new_username = request.data.get("new_username")

        if not username or not new_username:
            return Response(
                {"error": "Username and NewUsername are required"}, status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = get_object_or_404(CustomUser, username=username)
        except Http404:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if request.user != user:
            return Response(
                {"error": "You can only update your own username"},
                status=status.HTTP_403_FORBIDDEN,
            )
        
        if not re.match(r"^[a-zA-Z0-9_]{3,23}$", new_username):
            return Response(
                {"error": "Invalid username. Use only letters, numbers, and underscores (3-23 characters)"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if CustomUser.objects.filter(username=new_username).exists():
            return Response(
                {"error": "This username is already taken"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user.username = new_username
            user.save()
        except IntegrityError:
            return Response(
                {"error": "Database error. Try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except ValidationError as ex:
            return Response(
                {"error": f"Invalid data: {str(ex)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {"message": "Username updated successfully", "username": user.username},
            status=status.HTTP_200_OK,
        )
    
    #Update Email
    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated])
    def update_email(self, request):

        username = request.query_params.get("username")
        new_email = request.data.get("new_email")

        if not username or not new_email:
            return Response(
                {"error": "Username and Email are required"}, status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = get_object_or_404(CustomUser, username=username)
        except Http404:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
    
        if request.user != user:
            return Response(
                {"error": "You can only update your own email"},
                status=status.HTTP_403_FORBIDDEN,
            )
        
        try:
            EmailValidator(new_email)
        except ValidationError:
            return Response(
                {"error": "Invalid email format."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if CustomUser.objects.filter(email=new_email).exists():
            return Response(
                {"error": "This email is already taken"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user.email = new_email
            user.save()
        except IntegrityError:
            return Response(
                {"error": "Database error. Try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except ValidationError as ex:
            return Response(
                {"error": f"Invalid data: {str(ex)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response({"message": "Email updated successfully", "email": user.email}, status=status.HTTP_200_OK)
    
    #Update Password
    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated])
    def update_password(self, request):

        username = request.query_params.get("username")
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not username or not old_password or not new_password:
            return Response(
                {"error": "Username, old password, and new password are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        user = get_object_or_404(CustomUser, username=username)
    
        if request.user != user:
            return Response(
                {"error": "You can only update your own password"},
                status=status.HTTP_403_FORBIDDEN,
            )
        
        if not user.check_password(old_password):
            return Response(
                {"error": "Incorrect old password"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(new_password) < 8:
            return Response(
                {"error": "New password must be at least 8 characters long"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        user.set_password(new_password)
        user.save()

        tokens = OutstandingToken.objects.filter(user=user)
        for token in tokens:
            BlacklistedToken.objects.get_or_create(token=token)

        return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)

    
    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated])
    def upload_avatar(self, request):

        user = request.user
        if "avatar_image" not in request.data:
            return Response({"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)

        avatar_serializer = AvatarUpdateSerializer(user, data=request.data, partial=True)
        if avatar_serializer.is_valid():
            avatar_serializer.save()
            return Response({"message": "Avatar updated successfully"}, status=status.HTTP_200_OK)
        
        return Response(avatar_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        