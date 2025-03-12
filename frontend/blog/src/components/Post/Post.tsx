import React from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

interface Author {
  id: string;
  username: string;
  email: string;
  avatar?: string;
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
  const formattedDate = format(new Date(item.created_at), "MMMM d, yyyy");

  const userAvatar = item.author?.avatar ? (
    <Image
      className="rounded-full w-[40px] h-[40px] object-cover"
      src={item.author?.avatar}
      alt={`avatar_of_${item.author?.username}`}
      width={40}
      height={40}
    />
  ) : (
    <div className="w-[50px] h-[50px] bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-[20px]">
      {item.author?.username.slice(0, 2).toUpperCase()}
    </div>
  );

  return (
    <div className="container">
      <div className="post">
        <div className="post-header flex items-center gap-[20px] mb-[10px]">
          <div className="author-info flex items-center gap-[20px]">
            <Link href={`/profile/${item.author.username}`}>{userAvatar}</Link>
            <Link href={`/profile/${item.author.username}`}>
              {item.author.username}
            </Link>
          </div>
          <time dateTime={item.created_at} className="post-date">
            {formattedDate}
          </time>
        </div>
        <div className="image__wrapper">
          {item.photo && (
            <Image
              src={item.photo}
              alt={item.text}
              width={400}
              height={400}
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
