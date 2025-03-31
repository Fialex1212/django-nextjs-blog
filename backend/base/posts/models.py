import uuid
from django.db import models
from users.models import CustomUser
from imagekit.models import ProcessedImageField


class Post(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    text = models.TextField(max_length=300)
    photo = ProcessedImageField(upload_to="posts/", null=True, blank=True, format="JPEG", options={"quality": 85})
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Post by {self.author} at {self.created_at}"

    @property
    def count_likes(self):
        return self.post_likes.count()


class PostLike(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, related_name="post_likes", on_delete=models.CASCADE)

    class Meta:
        unique_together = ("user", "post")

    def __str__(self):
        return f"Like by {self.user} on Post {self.post.id}"