"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { createComment, deletePost, likePost } from "@/utils/api";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { MessageCircle, Send, Ellipsis } from "lucide-react";
import { usePostsStore } from "@/store/usePostsStore";
import { FieldValues, useForm } from "react-hook-form";
import Like from "../Like";
import Popup from "../Popup";
import { PostProps } from "@/types";

const PostItem = ({ item }: { item: PostProps }) => {
  const formattedDate = format(new Date(item.created_at), "MMMM d, yyyy");
  const { token, user } = useAuthStore();
  const [postLikes, postSetLikes] = useState<number>(
    Number(item.count_likes) || 0
  );
  const [postLiked, postSetLiked] = useState<boolean>(item.is_liked || false);
  const [isPopup, setIsPopup] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

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

  const handleCopy = () => {
    navigator.clipboard
      .writeText(`http://localhost:3000/post/${item.id}`)
      .then(() => toast.success("Link copied"))
      .catch((error) => console.error("Failed to copy:", error));
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

  const onSubmit = async (data: FieldValues) => {
    console.log(data.comment);

    if (!user?.id) {
      toast.error("User's current email is not available.");
      return;
    }

    try {
      await createComment(item.id, data.comment);
      toast.success("Comment was successfuly ");
      window.location.reload();
    } catch {}

    reset();
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
        <time dateTime={item.created_at} className="post-date mr-auto">
          {formattedDate}
        </time>
        <button className="w-[40px] h-[40px]" onClick={() => setIsPopup(true)}>
          <Ellipsis />
        </button>
        <Popup isOpen={isPopup} onClose={() => setIsPopup(false)}>
          <ul className="post__menu flex flex-col gap-[10px] items-center ">
            {item.author.id == user?.id ? (
              <>
                <li>
                  <Link
                    className="cursor-pointer group relative flex gap-1.5 px-8 py-4 bg-black bg-opacity-95 text-[#f1f1f1] rounded-xl hover:bg-opacity-85 transition font-semibold shadow-md"
                    href={`/post/${item.id}/update`}
                  >
                    Update
                  </Link>
                </li>
                <li>
                  <button
                    className="cursor-pointer group relative flex gap-1.5 px-8 py-4 bg-black bg-opacity-95 text-[#f1f1f1] rounded-xl hover:bg-opacity-85 transition font-semibold shadow-md"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button
                  className="cursor-pointer group relative flex gap-1.5 px-8 py-4 bg-black bg-opacity-95 text-[#f1f1f1] rounded-xl hover:bg-opacity-85 transition font-semibold shadow-md"
                  onClick={handleDelete}
                >
                  Do not recommend me
                </button>
              </li>
            )}
          </ul>
        </Popup>
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
          <Like
            liked={postLiked}
            setLiked={postSetLiked}
            likes={postLikes}
            setLikes={postSetLikes}
            like={likePost}
            id={item.id}
          />
          <Link href={`/post/${item.id}`}>
            <MessageCircle size={24} />
          </Link>
          <button onClick={handleCopy}>
            <Send size={24} />
          </button>
        </div>

        <div className="flex gap-[10px]">
          <p>Total likes</p> <p>{postLikes}</p>
        </div>
        <div className="post-text flex gap-[10px]">
          <p>{item.author.username}</p> <p>{item.text}</p>{" "}
        </div>
        <div>
          {item.comments.length === 0 ? (
            <p>No comments yet</p>
          ) : (
            <p>
              <Link href={`/post/${item.id}`}>
                Look at all comments ({item.comments.length})
              </Link>
            </p>
          )}
        </div>
        <div className="w-full">
          <form
            className="flex justify-between"
            onSubmit={handleSubmit(onSubmit)}
          >
            <label className="w-full">
              <input
                {...register("comment")}
                className="border-black-500 border-style: dashed w-full"
                type="text"
                placeholder="Add comment"
              />
              {errors.comment && (
                <p className="text-red-500">{`${errors.comment.message}`}</p>
              )}
            </label>
            <button type="submit" disabled={isSubmitting}>
              publish
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
