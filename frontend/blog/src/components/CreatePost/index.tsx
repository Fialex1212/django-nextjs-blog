"use client";

import { useState } from "react";
import { createPost } from "@/utils/api";
import { usePostsStore } from "@/store/usePostsStore";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useImagePreveiw } from "@/hooks/useImagePreview";

const CreatePost = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ text: "" });
  const [loading, setLoading] = useState(false);
  const { fetchPosts } = usePostsStore();
  const { token } = useAuthStore();

  const { preview, file, error, handleFileChange } = useImagePreveiw();

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!token) {
        toast.error("You need to be logged in to like a post.");
        throw new Error("No authentication token found.");
      }

      if (!file) {
        toast.error("Please select a photo.");
        throw new Error("Photo is required.");
      }

      const data = new FormData();
      data.append("text", formData.text);
      data.append("photo", file);

      await createPost(token, data);

      setFormData({ text: "" });
      router.push("/");
      await fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="flex flex-col min-h-[calc(100vh-236px)]">
        <form
          className="flex flex-col  gap-4"
          onSubmit={handleSubmit}
        >
          <div className="w-full">
            <label>
              <textarea
                name="text"
                id="text"
                value={formData.text}
                onChange={handleTextChange}
                required
                placeholder="Text"
                className="w-full text-white p-4 rounded-lg bg-black text-sm font-bold resize-none focus:outline-white focus:bg-opacity-90 focus:text-gray-300"
              />
            </label>
          </div>
          <label htmlFor="photo" className="custum-file-upload">
            <div className="icon">
              <svg
                viewBox="0 0 24 24"
                fill=""
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                    fill=""
                  ></path>{" "}
                </g>
              </svg>
            </div>
            <div className="text">
              <span>Click to upload image</span>
            </div>
            <input
              name="photo"
              type="file"
              id="photo"
              onChange={handleFileChange}
            />
          </label>
          {preview && (
            <div>
              <Image
                src={preview}
                alt="Selected Preview"
                width={200}
                height={200}
              />
            </div>
          )}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button
            className="w-full cursor-pointer group relative flex justify-center gap-1.5 px-8 py-4 bg-black bg-opacity-95 text-[#f1f1f1] rounded-xl hover:bg-opacity-85 transition font-semibold shadow-md"
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading..." : "Create Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
