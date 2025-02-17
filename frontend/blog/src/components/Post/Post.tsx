import React from "react";
import Image from "next/image";

interface Author {
  id: string;
  username: string;
  email: string;
  photo?: string;
}

interface PostItem {
  id: string;
  author: Author;
  text: string;
  photo: string;
  created_at: string;
}

interface PostProps {
  item: PostItem;
}

const Post: React.FC<PostProps> = ({ item }) => {
  const authorPhoto = item.author.photo
    ? item.author.photo
    : `https://ui-avatars.com/api/?name=${item.author.username}&size=40`;

  return (
    <div className="post">
      <div className="post-header">
        <div className="author-info">
          <Image
            src={authorPhoto}
            alt={item.author.username}
            width={40}
            height={40}
            className="author-photo"
          />
          <p className="author-name">{item.author.username}</p>
        </div>
        <time dateTime={item.created_at} className="post-date">
          {new Date(item.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            day: "numeric",
            month: "long",
          })}
        </time>
      </div>

      {item.photo && (
          <Image
            src={item.photo}
            alt={item.text}
            width={200}
            height={200}
            className="post-photo"
          />
      )}

      <div className="post-content">
        <h4 className="author-email">{item.author.email}</h4>
        <p className="post-text">{item.text}</p>
      </div>
    </div>
  );
};

export default Post;
