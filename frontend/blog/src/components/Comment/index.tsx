"use client";

import { format } from "date-fns";
import { getUserAvatar } from "@/utils/userAvatar";
import Like from "@/components/Like";
import { useState } from "react";
import { likeComment } from "@/utils/api";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { Ellipsis } from "lucide-react";
import Popup from "../Popup";

import { CommentProps } from "@/types";

const Comment = ({ comment }: { comment: CommentProps }) => {
  const [commentLikes, commentSetLikes] = useState<number>(
    Number(comment.count_likes) || 0
  );
  const [commentLiked, commentSetLiked] = useState<boolean>(
    comment.is_liked || false
  );
  const [isPopup, setIsPopup] = useState<boolean>(false);
  const { user } = useAuthStore();

  const handleDelete = () => {};

  return (
    <li className="flex flex-col justify-center gap-4 text-[16px] w-full group">
      <div className="flex items-center justify-between gap-4">
        <div className="flex justify-center items-center gap-4">
          {getUserAvatar(comment.author)}
          <div>
            <span>{comment.author.username}</span> {comment.text}
          </div>
        </div>
        <div>
          <Like
            liked={commentLiked}
            setLiked={commentSetLiked}
            likes={commentLikes}
            setLikes={commentSetLikes}
            like={likeComment}
            id={comment.id}
          />
        </div>
        <Popup isOpen={isPopup} onClose={() => setIsPopup(false)}>
          <ul className="post__menu flex flex-col gap-[10px] items-center ">
            {comment.author.id == user?.id ? (
              <>
                <li>
                  <Link
                    className="cursor-pointer group relative flex gap-1.5 px-8 py-4 bg-black bg-opacity-95 text-[#f1f1f1] rounded-xl hover:bg-opacity-85 transition font-semibold shadow-md"
                    href={`/post/${comment.id}/update`}
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
                <button className="cursor-pointer group relative flex gap-1.5 px-8 py-4 bg-black bg-opacity-95 text-[#f1f1f1] rounded-xl hover:bg-opacity-85 transition font-semibold shadow-md">
                  Do not recommend me
                </button>
              </li>
            )}
          </ul>
        </Popup>
      </div>

      <div className="flex items-center gap-4">
        <p>{format(new Date(comment.created_at), "MMMM d, yyyy")}</p>
        <div className="flex gap-[10px]">
          <p>Total likes</p> <p>{commentLikes}</p>
        </div>
        <button
          className="w-[40px] h-[40px] opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setIsPopup(true)}
        >
          <Ellipsis />
        </button>
      </div>
    </li>
  );
};

export default Comment;
