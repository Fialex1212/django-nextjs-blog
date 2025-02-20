"use client";
import { useEffect } from "react";
import { usePostsStore } from "@/store/usePostsStore";
import Post from "../Post/Post";

const Home = () => {
  const { posts, loading, error, fetchPosts } = usePostsStore();


  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

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
          {posts.length > 0 ? (
            posts.map((post) => (
              <li className="w-full" key={post.id}>
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
