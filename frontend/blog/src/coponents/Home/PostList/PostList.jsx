"use client";

import React, { useEffect } from "react";
import css from "./styles.module.css";
import PostCard from "../../PostCard/PostCard";
import { usePostsStore } from "@/store/usePostsStore";
import { useAuthStore } from "@/store/useAuthStore";

const PostList = () => {
  const { posts, fetchPosts } = usePostsStore();
  const { checkAuthStatus } = useAuthStore();

  console.log(posts);
  

  useEffect(() => {
    fetchPosts();
    checkAuthStatus();
  }, [fetchPosts, checkAuthStatus]);

  if (!Array.isArray(posts)) {
    return <div>Loading...</div>;
  }

  return (
    <ul className={css.posts__list}>
      {posts.length === 0 ? (
        <div>No posts available.</div>
      ) : (
        posts.map((item) => (
          <li key={item.id}>
            <PostCard item={item} />
          </li>
        ))
      )}
    </ul>
  );
};

export default PostList;
