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
      console.log(errorMessage);
      toast.error("Registration failed");
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
      console.log(errorMessage);
      toast.error("Invalid credentials");
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
      console.log(errorMessage);
      toast.error("Failed to fetch user data");
    } else {
      toast.error("Failed to fetch user data");
    }
  }
}

export async function getUserDetail(username: string) {
  try {
    const res = await axios.get(
      `${API_URL}/auth/user_detail/?username=${username}`,
      {}
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.error || "Failed to fetch user data";
      console.log(errorMessage);
      toast.error("Failed to fetch user data");
    } else {
      toast.error("Failed to fetch user data");
    }
  }
}

export async function getPosts(limit = 10, page = 1) {
  try {
    const res = await axios.get(`${API_URL}/blog/posts/`, {
      params: {
        limit,
        page,
      },
    });
    console.log("Fetched posts:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return null;
  }
}

export async function getPost(id: string) {
  try {
    const res = await axios.get(`${API_URL}/blog/posts/${id}/`, {});
    console.log("Fetched posts:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return null;
  }
}

export async function createPost(token: string, data: FormData) {
  try {
    const res = await axios.post(`${API_URL}/blog/posts/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        "An unexpected error occurred while creating the post. Please try again later.";
      console.log(errorMessage);
      toast.error(
        "An unexpected error occurred while creating the post. Please try again later"
      );
    } else {
      toast.error(
        "An unexpected error occurred while creating the post. Please try again later"
      );
    }
  }
}

export async function likePost(token: string, id: string) {
  try {
    const request = await axios.post(
      `${API_URL}/blog/posts/${id}/like/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return request.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.error || "Failed to like a post";
      if (error.response?.status === 401) {
        console.log("Unauthorized! Please log in.");
        toast.error("Unauthorized! Please log in.");
      } else {
        console.log(errorMessage);
      }
    } else {
      console.log("Failed to like a post", error);
    }
  }
}

export async function searchQuery(query: string) {
  try {
    const request = await axios.get(`${API_URL}/search/?search=${query}`, {});
    console.log(request.data);
    return request.data;
  } catch (error) {
    console.log("Failed to search", error);
  }
}
