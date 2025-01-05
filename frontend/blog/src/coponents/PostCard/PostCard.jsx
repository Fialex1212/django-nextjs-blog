import React from "react";
import css from "./styles.module.css";
import Image from "next/image";
import Tag from "@/coponents/Tag/Tag";

const PostCard = ({ item }) => {
  return (
    <div className={css.post}>
      <Image src={item.image} alt={item.title} width={326} height={228} />
      <time dateTime={item.created_at}>
        {new Date(item.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          day: "numeric",
          month: "long",
        })}
      </time>
      <h4>{item.title}</h4>
      <p>{item.description}</p>
      <ul className={css.tags__list}>
        {item.tags.map((tag, index) => (
          <li key={index}>
            <Tag tag={tag} />
          </li>
        ))}
      </ul> 
    </div>
  );
};

export default PostCard;
