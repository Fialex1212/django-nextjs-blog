import React from "react";
import Link from "next/link";
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
  count_likes: number; 
  is_liked: boolean; 
}

interface PostProps {
  item: PostItem;
}

const Post: React.FC<PostProps> = ({ item }) => {
  const authorPhoto = item.author.photo
    ? item.author.photo
    : `https://ui-avatars.com/api/?name=${item.author.username}&size=40`;
  return (
    <div className="container">
      <div className="post">
        <div className="post-header flex items-center gap-[20px] mb-[10px]">
          <div className="author-info flex items-center gap-[20px]">
            <Link href={`/profile/${item.author.username}`}>
              <Image
                src={authorPhoto}
                alt={item.author.username}
                width={40}
                height={40}
                className="author-photo"
              />
            </Link>
            <Link href={`/profile/${item.author.username}`}>
              {item.author.username}
            </Link>
          </div>
          <time dateTime={item.created_at} className="post-date">
            {new Date(item.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              day: "numeric",
              month: "long",
            })}
          </time>
        </div>
        <div className="image__wrapper">
          {item.photo && (
            <Image
              src={item.photo}
              alt={item.text}
              width={300}
              height={300}
              className="post-photo"
            />
          )}
        </div>
        <div className="post-content">
          <p className="post-text">{item.text}</p>
        </div>
      </div>
    </div>
  );
};

export default Post;
