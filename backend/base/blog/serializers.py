from rest_framework import serializers
from .models import Post, Comment
from users.serializers import UserSerializer


class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())

    class Meta:
        model = Comment
        fields = ["id", "author", "post", "text", "created_at", "updated_at"]


class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    comments = CommentSerializer(read_only=True, many=True)
    count_likes = serializers.SerializerMethodField() 
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "author",
            "text",
            "photo",
            "created_at",
            "updated_at",
            "comments",
            "is_liked",
            "count_likes",
        ]
        read_only_fields = ["id", "author", "created_at"]

    #func for get a boolean value if my request.user liked this post to display is liked icon
    def get_is_liked(self, obj):
        user = self.context.get("request").user
        if not user.is_authenticated:
            return False
        return obj.post_likes.filter(user=user).exists()

    #func for get a number of total likes
    def get_count_likes(self, obj):
        return obj.count_likes

    def create(self, validated_data):
        validated_data.pop("author", None)
        return Post.objects.create(
            author=self.context["request"].user, **validated_data
        )
