"use client";
import { useEffect } from "react";
import { usePostsStore } from "@/store/usePostsStore";
import PostList from "../PostList";
import Spinner from "../Spinner";
import ErrorMessage from "../ErrorMessage";

const Home = () => {
  const { loading, error, page, fetchPosts } = usePostsStore();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, page]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen] mb-[20px]">
      <div className="container flex justify-center">
        <PostList />
      </div>
    </div>
  );
};

export default Home;
