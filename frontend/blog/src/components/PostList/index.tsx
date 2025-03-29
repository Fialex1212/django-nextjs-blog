import React from "react";
import PostItem from "../Post";
import { usePostsStore } from "@/store/usePostsStore";

const PostList = () => {
  const { posts } = usePostsStore();

  return (
    <ul className="posts__list flex flex-col gap-[20px] w-[400px]">
      {posts && posts.length > 0 ? (
        posts.map((post, index) => (
          <li className="w-full" key={index}>
            <div className="mb-[20px]">
              <PostItem item={post} />
            </div>

            <div className="w-full h-[2px] bg-gray-500"></div>
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
