from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from .models import Post, PostLike
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

    def test_create_post(self):
        url = "/api/posts/"
        data = {"text": "New Test Post"}
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Post.objects.count(), 2)

    def test_like_post(self):
        url = f"/api/posts/{self.post.id}/like/"
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(PostLike.objects.count(), 1)

    def test_unlike_post(self):
        PostLike.objects.create(user=self.user, post=self.post)
        url = f"/api/posts/{self.post.id}/like/"
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(PostLike.objects.count(), 0)

    def test_update_post(self):
        url = f"/api/posts/{self.post.id}/"
        data = {"text": "Update Text Post"}
        self.client.force_authenticate(user=self.user)
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.post.refresh_from_db()
        self.assertEqual(self.post.text, "Update Text Post")

    def test_delete_post(self):
        url = f"/api/posts/{self.post.id}/"
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Post.objects.count(), 0)
