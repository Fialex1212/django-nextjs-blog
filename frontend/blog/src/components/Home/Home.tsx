"use client";
import { useEffect, useRef } from "react";
import { usePostsStore } from "@/store/usePostsStore";
import Post from "../Post/Post";

const Home = () => {
  const { posts, loading, error, page, fetchPosts } = usePostsStore();
  // const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchPosts(100, page);
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
        <ul className="posts__list flex flex-col gap-[20px] w-[300px]">
          {posts && posts.length > 0 ? (
            posts.map((post, index) => (
              <li className="w-full" key={index}>
                <Post item={post} />
              </li>
            ))
          ) : (
            <li>
              <p>No posts available.</p>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Home;
