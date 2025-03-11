import React from "react";
import PostItem from "./PostItem";
import { usePostsStore } from "@/store/usePostsStore";

const PostList = () => {

  const { posts } = usePostsStore();

  return (
    <ul className="posts__list flex flex-col gap-[20px] w-[400px]">
      {posts && posts.length > 0 ? (
        posts.map((post, index) => (
          <li className="w-full" key={index}>
            <PostItem item={post} />
          </li>
        ))
      ) : (
        <li>
          <p>No posts available.</p>
        </li>
      )}
    </ul>
  );
};

export default PostList;
