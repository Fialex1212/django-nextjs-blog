"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import PostItem from "@/components/Post/PostItem";
import { getPost } from "@/utils/api";

export default function PostPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); 
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (id) {
      console.log("Fetching post with ID:", id);
      getPost(id)
        .then((data) => {
          console.log("Received post data:", data);
          setPost(data);
        })
        .catch((error) => console.error("Error fetching post:", error));
    }
  }, [id]);

  if (!post) return <p>Loading...</p>;

  return <PostItem item={post} />;
}
