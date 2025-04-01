from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()


class AuthTests(APITestCase):
    def setUp(self):
        
        self.client = APIClient()
        self.user_data = {
            "username": "testuser",
            "password": "securepassword123",
            "email": "testuser@example.com",
        }
        self.user = User.objects.create_user(**self.user_data)

    def test_register_user(self):
        """Test user registration"""
        payload = {
            "username": "newuser",
            "password": "securepassword123",
            "email": "newuser@example.com",
        }
        response = self.client.post("/api/auth/register/", payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_login_user(self):
        """Test user login"""
        payload = {
            "username": self.user_data["username"],
            "password": self.user_data["password"],
        }
        response = self.client.post("/api/auth/login/", payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_invalid_login(self):
        """Test login with incorrect credentials"""
        payload = {"username": self.user_data["username"], "password": "wrongpassword"}
        response = self.client.post("/api/auth/login/", payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "Invalid credentials")

    def test_get_user_details(self):
        """Test retrieving user details"""
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/auth/me/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], self.user.username)

    def test_update_username(self):
        """Test updating username"""
        self.client.force_authenticate(user=self.user)
        payload = {"new_username": "updateduser"}
        response = self.client.post(
            f"/api/auth/update_username/?username={self.user.username}", payload
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "updateduser")

    def test_update_password(self):
        """Test updating password"""
        self.client.force_authenticate(user=self.user)
        payload = {
            "old_password": self.user_data["password"],
            "new_password": "newstrongpass123",
        }
        response = self.client.post(
            f"/api/auth/update_password/?username={self.user.username}", payload
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Password updated successfully")
