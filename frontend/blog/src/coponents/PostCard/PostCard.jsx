import React from "react";
import css from "./styles.module.css";
import Image from "next/image";
import Tag from "@/coponents/Tag/Tag";

const PostCard = ({ item }) => {

  const authorPhoto = item.author.photo
    ? item.author.photo
    : `https://ui-avatars.com/api/?name=${item.author.fullname}&background=balck&color=fff&size=40`;

  return (
    <div className={css.post}>
      <div className={css.post__header}>
        <Image src={authorPhoto } alt={item.author.fullname} width={40} height={40}/>
        <p>{item.author.fullname}</p>
      </div>
      <div className={css.post__content}></div>
      <div className={css.post__footer}></div>
      <Image src={item.photo} alt={item.text} width={200} height={200} />
      <time dateTime={item.created_at}>
        {new Date(item.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          day: "numeric",
          month: "long",
        })}
      </time>
      <h4>{item.author.email}</h4>
      <p>{item.text}</p>
    </div>
  );
};

export default PostCard;
