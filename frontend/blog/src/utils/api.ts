import axios from "axios";
import { toast } from "sonner";

const API_URL = "http://127.0.0.1:8000/api";

export async function registerUser(
  username: string,
  email: string,
  password: string
) {
  try {
    const res = await axios.post(`${API_URL}/auth/register/`, {
      username,
      email,
      password,
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || "Registration failed";
      toast.error(errorMessage);
    } else {
      toast.error("Registration failed");
    }
  }
}

export async function loginUser(username: string, password: string) {
  try {
    const res = await axios.post(`${API_URL}/auth/login/`, {
      username,
      password,
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || "Invalid credentials";
      toast.error(errorMessage);
    } else {
      toast.error("Invalid credentials");
    }
  }
}

export async function getUser(token: string) {
  try {
    const res = await axios.get(`${API_URL}/auth/me/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.error || "Failed to fetch user data";
      toast.error(errorMessage);
    } else {
      toast.error("Failed to fetch user data");
    }
  }
}

export async function getPosts() {
  try {
    const res = await axios.get(`${API_URL}/blog/posts/`, {});
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export async function createPost(token, data) {
  try {
    const res = await axios.post(
      `${API_URL}/blog/posts/create/`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.error || "Failed while creating a post";
      toast.error(errorMessage);
    } else {
      toast.error("Failed while creating a post");
    }
  }
}
