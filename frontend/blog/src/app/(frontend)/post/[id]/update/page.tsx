"use client";

import ErrorMessage from "@/components/ErrorMessage";
import Loading from "@/components/Loading";
import NoPost from "@/components/NoPost";
import UpdatePost from "@/components/UpdatePost";
import { usePostStore } from "@/store/usePostStore";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function UpdatePostPage() {
  const params = useParams();
  const { id } = params;
  const { post, loading, error, fetchPost } = usePostStore();

  useEffect(() => {
    fetchPost(id);
  }, [id, fetchPost]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!post) return <NoPost />;
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
