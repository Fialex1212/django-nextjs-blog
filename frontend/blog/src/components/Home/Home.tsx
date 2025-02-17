"use client";
import { useEffect, useState } from "react";
import { usePostsStore } from "@/store/usePostsStore";
import Post from "../Post/Post";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import Image from "next/image";
import CreatePost from "../Post/CreatePost";

const Home = () => {
  const { posts, loading, error, fetchPosts } = usePostsStore();
  const { user } = useAuthStore();
  const authorPhoto = user?.avatar
    ? user?.avatar
    : `https://ui-avatars.com/api/?name=${user?.username}&size=40`;

  const [modalIsOpen, setIsOpen] = useState(false);

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
    <div className="flex flex-col items-center justify-start min-h-screen px-[15px]">
      <header className="py-[40px] flex justify-between w-screen px-[15px]">
        <div>Logo</div>
        {user ? (
          <div className="user__interface flex gap-[40px]">
            <CreatePost modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} />
            <div className="avatar__wrapper">
              <Image
                src={authorPhoto}
                alt={user?.username}
                width={50}
                height={50}
                className="user__avatar rounded-[50px]"
              />
            </div>
          </div>
        ) : (
          <div>
            <Link href={"login"}>Login</Link>
          </div>
        )}
      </header>
      <ul className="posts__list flex flex-col gap-[20px]">
        {posts.length > 0 ? (
          posts.map((post) => (
            <li key={post.id}>
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
  );
};

export default Home;
