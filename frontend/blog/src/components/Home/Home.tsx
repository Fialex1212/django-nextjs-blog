"use client";
import { useEffect } from "react";
import { usePostsStore } from "@/store/usePostsStore";
import PostList from "../Post/PostList";

const Home = () => {
  const { loading, error, page, fetchPosts } = usePostsStore();
  // const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, page]);

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     ([entry]) => {
  //       if (entry.isIntersecting && !loading) {
  //         fetchPosts(5, page);
  //       }
  //     },
  //     {
  //       rootMargin: "100px",
  //     }
  //   );
  //   if (loaderRef.current) {
  //     observer.observe(loaderRef.current);
  //   }

  //   return () => {
  //     if (loaderRef.current) {
  //       observer.unobserve(loaderRef.current);
  //     }
  //   };
  // }, [loading, page, fetchPosts]);

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen]">
      <div className="container flex justify-center">
        <PostList />
      </div>
    </div>
  );
};

export default Home;
