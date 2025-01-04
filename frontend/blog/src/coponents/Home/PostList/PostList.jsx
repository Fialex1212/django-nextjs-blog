import React from "react";
import css from "./styles.module.css";
import PostCard from "../PostCard/PostCard";
import { posts } from "./utils";

const PostList = () => {
  return (
    <ul className={css.posts__list}>
      {posts.map((item, index) => (
        <li key={index}>
          <PostCard item={item} />
        </li>
      ))}
    </ul>
  );
};

export default PostList;
