"use client";
import Comment from "./Comment/Comment";

interface Author {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

interface CommentProps {
  comments: CommentProps[];
}

interface CommentProps {
  id: string;
  author: Author;
  text: string;
  created_at: string;
  count_likes: number;
  is_liked: boolean;
}

const CommentsList: React.FC<CommentProps> = ({ comments }) => {
  return (
    <div className="overflow-y-auto ">
      <ul className="comments flex flex-col items-start justify-start w-[400px] gap-4">
        {comments.map((comment, index) => (
          <Comment key={index} comment={comment} />
        ))}
      </ul>
    </div>
  );
};

export default CommentsList;
