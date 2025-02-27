import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Modal from "react-modal";
import { likePost } from "@/utils/api";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

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

const PostItem: React.FC<PostProps> = ({ item }) => {
  const { token } = useAuthStore();
  const [likes, setLikes] = useState<number>(Number(item.count_likes) || 0);
  const [liked, setLiked] = useState<boolean>(item.is_liked || false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const authorPhoto = item.author.photo
    ? item.author.photo
    : `https://ui-avatars.com/api/?name=${item.author.username}&size=40`;

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleLike = async () => {
    try {
      const response = await likePost(token, item.id);
      if (response.message === "Post liked") {
        setLiked(true);
        setLikes((prev) => prev + 1);
      } else if (response.message === "Like removed") {
        setLiked(false);
        setLikes((prev) => prev - 1);
      }
    } catch {
      toast.error("Failed to like a post");
    }
  };

  return (
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
      <div className="image__wrapper" onClick={openModal}>
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
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Post detail"
        ariaHideApp={false}
      >
        <button className="close" onClick={closeModal}></button>
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
          <div className="image__wrapper" onClick={openModal}>
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
      </Modal>
      <div className="post-content">
        <p className="post-text">{item.text}</p>
        <button onClick={handleLike}>
          {liked ? "❤️" : "👍"} {likes}
        </button>
      </div>
    </div>
  );
};

export default PostItem;
