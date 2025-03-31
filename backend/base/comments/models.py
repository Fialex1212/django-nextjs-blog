import uuid
from django.db import models
from users.models import CustomUser
from posts.models import Post

class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, related_name="comments", on_delete=models.CASCADE)
    text = models.TextField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Comment by {self.author} at {self.created_at}"


class CommentLike(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    comment = models.ForeignKey(
        Comment, related_name="comment_likes", on_delete=models.CASCADE
    )

    class Meta:
        unique_together = ("user", "comment")

    def __str__(self):
        return f"Like by {self.user} on Comment {self.comment.id}"
