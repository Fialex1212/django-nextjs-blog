"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { deletePost, likePost } from "@/utils/api";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Send } from "lucide-react";
import { usePostsStore } from "@/store/usePostsStore";

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
  const { token, user } = useAuthStore();
  const [likes, setLikes] = useState<number>(Number(item.count_likes) || 0);
  const [liked, setLiked] = useState<boolean>(item.is_liked || false);

  const userAvatar = item.author?.avatar ? (
    <Image
      className="rounded-full w-[40px] h-[40px] object-cover"
      src={item.author?.avatar}
      alt={`avatar_of_${item.author?.username}`}
      width={40}
      height={40}
    />
  ) : (
    <div className="w-[40px] h-[40px] bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-[20px]">
      {item.author?.username.slice(0, 2).toUpperCase()}
    </div>
  );

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

  const handleDelete = async () => {
    if (!token) {
      toast.error("You need to be logged in to delete a post");
      return;
    }

    try {
      await deletePost(token, item.id);
      toast.success(`Post with id ${item.id} was deleted`);
      usePostsStore.getState().deletePostFromStore(item.id);
    } catch {
      toast.error("Failed to delete the post");
    }
  };

  return (
    <div className="post">
      <div className="post-header flex items-center gap-[10px] mb-[10px]">
        <div className="author-info flex items-center gap-[10px]">
          <Link href={`/profile/${item.author.username}`}>{userAvatar}</Link>
          <Link href={`/profile/${item.author.username}`}>
            {item.author.username}
          </Link>
        </div>
        <time dateTime={item.created_at} className="post-date">
          {formattedDate}
        </time>
        <ul className="post__menu">
          {item.author.id == user?.id ? (
            <>
              {" "}
              <li>
                <Link href={`/post/${item.id}/update`}>Update</Link>
              </li>
              <li>
                <button onClick={handleDelete}>Delete</button>
              </li>
            </>
          ) : (
            <li>
              <button onClick={handleDelete}>Do not recommend me</button>
            </li>
          )}
        </ul>
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
