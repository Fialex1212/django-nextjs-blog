"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { updatePost } from "@/utils/api";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface UpdatePostProps {
  postId: string;
  initialText: string;
  initialPhoto?: string;
  onUpdate: (updatedText: string, updatedPhoto?: string) => void;
}

const UpdatePost: React.FC<UpdatePostProps> = ({
  postId,
  initialText,
  initialPhoto,
  onUpdate,
}) => {
  const router = useRouter();
  const { token } = useAuthStore();
  const [text, setText] = useState(initialText);
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("You need to be logged in to update a post");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("text", text);
    if (photo) formData.append("photo", photo);

    try {
      const response = await updatePost(token, postId, formData);
      if (response) {
        toast.success("Post updated successfully");
        onUpdate(response.text, response.photo);
      }
      router.push(`/post/${postId}`)
    } catch {
      toast.error("Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="update-post flex flex-col gap-4">
        <textarea
          className="border p-2 w-full rounded"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Update your post text"
        />
        <input type="file" accept="image/*" onChange={handlePhotoChange} />
        {initialPhoto && !photo && (
          <Image
            src={initialPhoto}
            alt="Current Post Image"
            width={400}
            height={400}
          />
        )}
        {photo && (
          <p className="text-sm text-gray-500">Selected image: {photo.name}</p>
        )}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Post"}
        </button>
      </form>
    </div>
  );
};

export default UpdatePost;
