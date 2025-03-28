"use client";

import { useEffect, useState } from "react";
import PostItem from "@/components/Post/PostItem";
import { getPost } from "@/utils/api";
import { useParams } from "next/navigation";
import CommentsList from "@/components/Comments/CommentsList";

interface Author {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

interface PostProps {
  id: string;
  author: Author;
  text: string;
  photo: string;
  comments: [];
  created_at: string;
  count_likes: number;
  is_liked: boolean;
}

export default function PostPage() {
  const params = useParams();
  const { id } = params;
  const [post, setPost] = useState<PostProps | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      setLoading(true);
      setError(null);

      try {
        const postId = Array.isArray(id) ? id[0] : id;

        console.log("Fetching post with ID:", id);
        const data = await getPost(postId);
        console.log("Received post data:", data);
        setPost(data);
      } catch (err: unknown) {
        console.error("Error fetching post:", err);
        if (err instanceof Error) {
          setError(err.message || "Failed to fetch post");
        } else {
          setError("Unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!post) return <p>No post found.</p>;

  return (
    <div className="container flex items-center justify-center gap-10 min-h-[calc(100vh-236px)]">
      <PostItem item={post} />
      <CommentsList comments={post.comments} />
    </div>
  );
}
