import axios from "axios";
import { toast } from "sonner";

const API_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response, // Directly return successful responses.
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.

      try {
        const refreshToken = localStorage.getItem("refreshToken"); // Retrieve the stored refresh token.
        if (!refreshToken) {
          throw new Error("No refresh token found.");
        }

        // Make a request to your auth server to refresh the token.
        const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Store the new access and refresh tokens.
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // Update the authorization header with the new access token.
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        return api(originalRequest); // Retry the original request with the new access token.
      } catch (refreshError) {
        // Handle refresh token errors by clearing stored tokens and redirecting to the login page.
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error); // For all other errors, return the error as is.
  }
);

export async function registerUser(
  username: string,
  email: string,
  password: string
) {
  try {
    const res = await api.post(`/auth/register/`, {
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
    const res = await api.post(`/auth/login/`, {
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
    const res = await api.get(`/auth/me/`, {
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
    const res = await api.get(`/auth/user_detail/?username=${username}`, {});
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
    const res = await api.get(`/blog/posts/`, {
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
    const res = await api.get(`/blog/posts/${id}/`, {});
    console.log("Fetched posts:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return null;
  }
}

export async function createPost(token: string, data: FormData) {
  try {
    const res = await api.post(`/blog/posts/`, data, {
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
    console.log("Token:", token);
    const request = await api.post(
      `/blog/posts/${id}/like/`,
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
    const request = await api.get(`/search/?search=${query}`, {});
    console.log(request.data);
    return request.data;
  } catch (error) {
    console.log("Failed to search", error);
  }
}
