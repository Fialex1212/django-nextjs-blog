from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from .models import Post, Comment, CommentLike
from rest_framework import status

User = get_user_model()


class PostTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            "username": "testuser",
            "password": "securepassword123",
            "email": "testuser@example.com",
        }
        self.user = User.objects.create_user(**self.user_data)
        self.client.login(username="testuser", password="testpassword")
        self.post = Post.objects.create(author=self.user, text="Test text")
        self.comment = Comment.objects.create(author=self.user, post=self.post, text="Test text")
    
    def test_create_comment(self):
        url = f"/api/comments/"
        data = {"text": "Test Comment", "post": f"{self.post.id}"}
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.count(), 2)

    def test_like_post(self):
        url = f"/api/comments/{self.comment.id}/like/"
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CommentLike.objects.count(), 1)

    def test_unlike_post(self):
        CommentLike.objects.create(user=self.user, comment=self.comment)
        url = f"/api/comments/{self.comment.id}/like/"
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(CommentLike.objects.count(), 0)

    def test_delete_post(self):
        url = f"/api/comments/{self.comment.id}/"
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Comment.objects.count(), 0)