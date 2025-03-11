"use client"

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { likePost } from "@/utils/api";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Send } from "lucide-react";

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

const PostItem: React.FC<PostProps> = ({ item }) => {
  const formattedDate = format(new Date(item.created_at), "MMMM d, yyyy");
  const { token } = useAuthStore();
  const [likes, setLikes] = useState<number>(Number(item.count_likes) || 0);
  const [liked, setLiked] = useState<boolean>(item.is_liked || false);

  const authorPhoto = item.author.avatar
    ? item.author.avatar
    : `https://ui-avatars.com/api/?name=${item.author.username}&size=40`;

  const handleLike = async () => {
    if (!token) {
      toast.error("You need to be logged in to like a post");
      return;
    }

    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));

    try {
      const response = await likePost(token, item.id);
      console.log("Response from server:", response);
      if (response.message === "Post liked") {
        setLiked(true);
      } else if (response.message === "Like removed") {
        setLiked(false);
      }
    } catch {
      setLiked((prev) => !prev);
      setLikes((prev) => (liked ? prev - 1 : prev + 1));
      toast.error("Failed to like a post");
    }
  };

  return (
    <div className="post">
      <div className="post-header flex items-center gap-[10px] mb-[10px]">
        <div className="author-info flex items-center gap-[10px]">
          <Link href={`/profile/${item.author.username}`}>
            <Image
              src={authorPhoto}
              alt={item.author.username}
              width={40}
              height={40}
              className="author-photo rounded-full w-[40px] h-[40px] object-cover"
            />
          </Link>
          <Link href={`/profile/${item.author.username}`}>
            {item.author.username}
          </Link>
        </div>
        <time dateTime={item.created_at} className="post-date">
          {formattedDate}
        </time>
        <div></div>
      </div>
      <div className="image__wrapper mb-[6px]">
        <Link href={`/post/${item.id}`}>
          {item.photo && (
            <Image
              src={item.photo}
              alt={item.text}
              width={400}
              height={400}
              className="post-photo"
            />
          )}
        </Link>
      </div>
      <div className="post__content flex flex-col items-start gap-[10px]">
        <div className="post__buttons flex gap-[6px]">
          <div className="relative cursor-pointer" onClick={handleLike}>
            {liked && (
              <motion.div
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center text-red-500"
              >
                <Heart size={24} fill="currentColor" />
              </motion.div>
            )}
            <Heart
              size={24}
              className={`transition-colors ${
                liked ? "text-red-500" : "text-black"
              }`}
              fill={liked ? "currentColor" : "none"}
            />
          </div>
          <button>
            <MessageCircle size={24} />
          </button>
          <button>
            <Send size={24} />
          </button>
        </div>

        <div className="flex gap-[10px]">
          <p>Total likes</p> <p>{likes}</p>
        </div>
        <div className="post-text flex gap-[10px]">
          <p>{item.author.username}</p> <p>{item.text}</p>{" "}
        </div>
      </div>
    </div>
  );
};

export default PostItem;
