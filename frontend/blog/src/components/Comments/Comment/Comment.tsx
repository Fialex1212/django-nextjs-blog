"use client";

import { format } from "date-fns";
import { getUserAvatar } from "@/utils/userAvatar";
import Like from "@/components/Like/Like";
import { useState } from "react";
import { likeComment } from "@/utils/api";

interface Author {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

interface CommentProps {
  id: string;
  author: Author;
  text: string;
  created_at: string;
  count_likes: number;
  is_liked: boolean;
}

const Comment = ({ comment }: { comment: CommentProps }) => {
  const [commentLikes, commentSetLikes] = useState<number>(
    Number(comment.count_likes) || 0
  );
  const [commentLiked, commentSetLiked] = useState<boolean>(
    comment.is_liked || false
  );
  return (
    <li>
      <div className="flex justify-center items-center gap-4">
        {getUserAvatar(comment.author)}
        <div>
          <span>{comment.author.username}</span> {comment.text}
        </div>
        <p>{format(new Date(comment.created_at), "MMMM d, yyyy")}</p>
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
      <div className="flex gap-[10px]">
          <p>Total likes</p> <p>{commentLikes}</p>
        </div>
    </li>
  );
};

export default Comment;
