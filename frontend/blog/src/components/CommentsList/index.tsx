"use client";
import { CommentProps } from "@/types";
import Comment from "../Comment";

const CommentsList: React.FC<{ comments: CommentProps[] }> = ({ comments }) => {
  return (
    <div className="overflow-y-auto h-[500px] overflow-x-hidden p-2 box-border">
      <ul className="comments flex flex-col items-start justify-start w-[400px] gap-6">
        {comments.map((comment, index) => (
          <Comment key={index} comment={comment} />
        ))}
      </ul>
    </div>
  );
};

export default CommentsList;
