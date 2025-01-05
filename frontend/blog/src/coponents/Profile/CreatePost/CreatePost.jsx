"use client";

import { useState } from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import css from "./styles.module.css";
import { useRouter } from "next/navigation";

const CreatePost = () => {
  const [formData, setFormData] = useState({
    text: "",
    photo: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Create an instance of Cookies
  const cookies = new Cookies();
  // Retrieve the token
  const token = cookies.get("access_token");

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
      const formDataToSend = new FormData();
      formDataToSend.append("text", formData.text);
      formDataToSend.append("photo", formData.photo);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/blog/posts/create/",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Post created successfully:", response.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        cookies.remove("access_token");
        router.push("/auth/login");
      } else {
        setError("Error creating post: " + (err.response?.data?.detail || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={css.create}>
      <div className="container">
        <h2>Create a New Post</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="text">Text</label>
            <textarea
              name="text"
              id="text"
              value={formData.text}
              onChange={handleTextChange}
            />
          </div>
          <div>
            <label htmlFor="photo">Photo</label>
            <input
              name="photo"
              type="file"
              id="photo"
              onChange={handleFileChange}
              required
            />
          </div>
          {preview && (
            <div>
              <img
                src={preview}
                alt="Selected Preview"
                style={{ maxWidth: "200px", maxHeight: "200px" }}
              />
            </div>
          )}
          {error && <p>{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Create Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
