"use client";

import { useState } from "react";
import { createPost } from "@/utils/api";
import { usePostsStore } from "@/store/usePostsStore";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const CreatePost = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    text: "",
    photo: null as File | null,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { fetchPosts } = usePostsStore();
  const { token } = useAuthStore();

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setError("No file selected.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB.");
      return;
    }

    setFormData({
      ...formData,
      photo: file,
    });

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append("text", formData.text);

      if (formData.photo) {
        data.append("photo", formData.photo);
      }

      if (!token) {
        toast.error("You need to be logged in to like a post.");
        throw new Error("No authentication token found.");
      }

      if (!formData.photo) {
        toast.error("Chose the photo.");
        throw new Error("Chose the photo.");
      }

      await createPost(token, data);

      setFormData({ text: "", photo: null });
      setPreview(null);

      await fetchPosts();
      router.push("/")
    } catch (error) {
      console.error("Error creating post:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create post."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <textarea
              name="text"
              id="text"
              value={formData.text}
              onChange={handleTextChange}
              required
              placeholder="Text"
              className="border-2 text-white border-gray-300 p-4 rounded-lg bg-black text-sm font-bold resize-none focus:outline-white focus:bg-opacity-85 focus:text-gray-300 focus:shadow-lg focus:shadow-gray-500"
            />
          </label>
        </div>
        <label htmlFor="photo" className="custum-file-upload">
          <div className="icon">
            <svg viewBox="0 0 24 24" fill="" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
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
          className="cursor-pointer group relative flex gap-1.5 px-8 py-4 bg-black bg-opacity-95 text-[#f1f1f1] rounded-xl hover:bg-opacity-85 transition font-semibold shadow-md"
          type="submit"
          disabled={loading}
        >
          {loading ? "Loading..." : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
