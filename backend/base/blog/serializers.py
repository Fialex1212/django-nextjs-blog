from rest_framework import serializers
from .models import Post, Comment
from users.serializers import UserSerializer

class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())

    class Meta:
        model = Comment
        fields = ['id', 'author', 'post', 'text', 'created_at', 'updated_at']

class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    comments = CommentSerializer(read_only=True, many=True)

    class Meta:
        model = Post
        fields = ['id', 'author', 'text', 'photo', 'created_at', 'updated_at', 'comments']

    def create(self, validated_data):
        return Post.objects.create(author=self.context['request'].user, **validated_data)