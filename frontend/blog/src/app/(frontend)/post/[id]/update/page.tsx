"use client";

import UpdatePost from "@/components/Post/UpdatePost";
import { getPost } from "@/utils/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Author {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

interface PostItem {
  id: string;
  author: Author;
  text: string;
  photo: string;
  comments: [];
  created_at: string;
  count_likes: number;
  is_liked: boolean;
}
export default function UpdatePostPage() {
  const params = useParams();
  const { id } = params;
  const [post, setPost] = useState<PostItem | null>(null);
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
  const handleUpdate = (updatedText: string, updatedPhoto?: string) => {
    console.log("Post updated:", { updatedText, updatedPhoto });
  };
  return (
    <div>
      <UpdatePost
        postId={post.id}
        initialText={post.text}
        initialPhoto={post.photo}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
