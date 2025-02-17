import React, { useState } from "react";
import Modal from "react-modal";
import { createPost } from "@/utils/api";
import { usePostsStore } from "@/store/usePostsStore";
import Image from "next/image";

const CreatePost = ({ modalIsOpen, setIsOpen }) => {
  const [formData, setFormData] = useState({
    text: "",
    photo: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { fetchPosts } = usePostsStore(); // Use the Zustand store to fetch posts after creation

  const handleTextChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.size > 5 * 1024 * 1024) {
      // Limit file size to 5MB
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append("text", formData.text);
      data.append("photo", formData.photo);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      await createPost(token, data);

      setFormData({ text: "", photo: null });
      setPreview(null);
      setIsOpen(false);

      await fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
      setError(error.message || "Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Create Post Modal"
      >
        <button onClick={closeModal}>Close</button>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="text">Text</label>
            <textarea
              name="text"
              id="text"
              value={formData.text}
              onChange={handleTextChange}
              required
            />
          </div>
          <div>
            <label htmlFor="photo">Photo</label>
            <input
              name="photo"
              type="file"
              id="photo"
              onChange={handleFileChange}
            />
          </div>
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
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Create Post"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default CreatePost;
