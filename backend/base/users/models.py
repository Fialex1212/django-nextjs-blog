# users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True, null=False, blank=False)
    photo = models.ImageField(upload_to='profile_photos/', null=True, blank=True)
