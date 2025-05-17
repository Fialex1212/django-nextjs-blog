import React from "react";
import PostItem from "../Post";
import { useEffect, useRef, useCallback } from "react";
import { usePostsStore } from "@/store/usePostsStore";

const PostList = () => {

  const observer = useRef<IntersectionObserver | null>(null);
  const { posts, fetchPosts, loading, hasMore } = usePostsStore();

  const lastPostRef = useCallback(
    (node: HTMLLIElement | null) => {
      if (loading || !hasMore) return;
  
      if (observer.current) observer.current.disconnect();
  
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          fetchPosts();
        }
      });
  
      if (node) observer.current.observe(node);
    },
    [loading, fetchPosts, hasMore]
  );
  

  useEffect(() => {
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);

  return (
    <ul className="posts__list flex flex-col gap-[20px] w-[400px]">
      {posts && posts.length > 0 ? (
        posts.map((post, index) => {
          const isLast = index === posts.length - 1;
          return (
            <li
              className="w-full"
              key={index}
              ref={isLast ? lastPostRef : null}
            >
              <div className="mb-[20px]">
                <PostItem item={post} />
              </div>

              <div className="w-full h-[1px] bg-black"></div>
            </li>
          );
        })
      ) : (
        <li>
          <p>No posts available.</p>
        </li>
      )}
    </ul>
  );
};

export default PostList;
