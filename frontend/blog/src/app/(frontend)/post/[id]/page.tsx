"use client";

import { useEffect } from "react";
import PostItem from "@/components/Post/PostItem";
import { useParams } from "next/navigation";
import CommentsList from "@/components/Comments/CommentsList";
import { usePostStore } from "@/store/usePostStore";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import NoPost from "@/components/NoPost";

export default function PostPage() {
  const params = useParams();
  const { id } = params;
  const { post, loading, error, fetchPost } = usePostStore();

  useEffect(() => {
    fetchPost(id);
  }, [id, fetchPost]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!post) return <NoPost />;

  return (
    <div className="container flex items-center justify-center gap-10 min-h-[calc(100vh-236px)]">
      <PostItem item={post} />
      <CommentsList comments={post.comments} />
    </div>
  );
}
