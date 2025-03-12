"use client"

import UpdatePost from "@/components/Post/UpdatePost";
import { getPost } from "@/utils/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdatePostPage() {
  const params = useParams();
  const { id } = params;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("Fetching post with ID:", id);
        const data = await getPost(id);
        console.log("Received post data:", data);
        setPost(data);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(err.message || "Failed to fetch post");
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
    <UpdatePost
      postId={post.id}
      initialText={post.text}
      initialPhoto={post.photo}
      onUpdate={handleUpdate}
    />
  );
}
