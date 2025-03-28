"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import React from "react";

const Like = ({ liked, setLiked, setLikes, likes, like, id }) => {
  const { token } = useAuthStore();

  const handleLike = async () => {
    if (!token) {
      toast.error("You need to be logged in to like a post");
      return;
    }

    // Toggle the liked state
    const newLikedState = !liked;
    setLiked(newLikedState);

    // Update postLikes based on the liked state
    const newLikesCount = newLikedState ? likes + 1 : likes - 1;
    setLikes(newLikesCount); // This ensures the likes count is updated on the frontend

    try {
      const response = await like(token, id);
      console.log("Response from server:", response);
      if (response.message === "Post liked") {
        setLikes(newLikesCount); // Correctly update the count after a successful like
      } else if (response.message === "Like removed") {
        setLikes(newLikesCount); // Correctly update the count if the like was removed
      }
    } catch {
      // If there is an error, revert the state to its original values
      setLiked(liked);
      setLikes(likes);
      toast.error("Failed to like a post");
    }
  };

  return (
    <div>
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
    </div>
  );
};

export default Like;
