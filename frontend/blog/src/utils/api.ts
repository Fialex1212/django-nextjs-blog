import { useAuthStore } from "@/store/useAuthStore";
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
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // console.log("Current token:", api.defaults.headers.common["Authorization"]);
    // console.log("Refresh token:", useAuthStore.getState().refresh_token);

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Помечаем, что запрос уже пытались повторить

      try {
        const authStore = useAuthStore.getState(); // <-- Получаем состояние хранилища правильно
        const refreshToken = authStore.refresh_token;

        if (!refreshToken) {
          throw new Error("No refresh token found.");
        }

        const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access, refresh } = response.data;

        authStore.rewriteToken(access);
        authStore.rewriteRefreshToken(refresh);

        console.log("Updated token:", authStore.token);
        console.log("Updated refresh token:", authStore.refresh_token);
        
        api.defaults.headers.common["Authorization"] = `Bearer ${access}`;
        originalRequest.headers["Authorization"] = `Bearer ${access}`;
        

        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        const authStore = useAuthStore.getState();
        authStore.logout();

        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 500);
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  console.log("📡 Using token in request:", token);
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});


//handler for adding token to request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

//REGISTER
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

//LOGIN
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

//USER

export const loginWithGoogle = async (googleToken: string) => {
  try {
    const response = await axios.post("/api/auth/google", {
      token: googleToken,
    });
    return response.data;
  } catch (error) {
    console.error("Error during Google login:", error);
    return null;
  }
};

//GET ME
export async function getUser() {
  try {
    const res = await api.get(`/auth/me/`);
    return res.data;
  } catch (error) {
    console.log("Failed to fetch user data", error);
  }
}

//GET USER DETAIL
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

//UPDATE USERNAME
export async function updateUsername(
  currentUsername: string,
  newUsername: string
) {
  try {
    const formData = new FormData();
    formData.append("new_username", newUsername);

    const res = await api.post(`/auth/update_username/`, formData, {
      params: { username: currentUsername },
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { data, status } = error.response;

      console.error("Error updating username:", data);

      if (status === 400 && data.error) {
        toast.error(data.error);
      } else if (status === 400 && typeof data === "object") {
        Object.values(data).forEach((msg) => {
          if (typeof msg === "string") {
            toast.error(msg);
          } else if (Array.isArray(msg)) {
            msg.forEach((m) => toast.error(m));
          }
        });
      } else if (status === 403) {
        toast.error("You don't have permission to change this username.");
      } else if (status === 404) {
        toast.error("User not found.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } else {
      toast.error("Failed to update username due to an unknown error.");
    }

    throw error;
  }
}

//UPDATE EMAIL
export async function updateEmail(currentUsername: string, newEmail: string) {
  try {
    const formData = new FormData();
    formData.append("new_email", newEmail);

    const res = await api.post(`/auth/update_email/`, formData, {
      params: { username: currentUsername },
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { data, status } = error.response;

      console.error("Error updating username:", data);

      if (status === 400 && data.error) {
        toast.error(data.error);
      } else if (status === 400 && typeof data === "object") {
        Object.values(data).forEach((msg) => {
          if (typeof msg === "string") {
            toast.error(msg);
          } else if (Array.isArray(msg)) {
            msg.forEach((m) => toast.error(m));
          }
        });
      } else if (status === 403) {
        toast.error("You don't have permission to change this username.");
      } else if (status === 404) {
        toast.error("User not found.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } else {
      toast.error("Failed to update username due to an unknown error.");
    }

    throw error;
  }
}

//UPDATE PASSWORD
export async function updatePassword(
  currentUsername: string,
  newPassword: string,
  oldPassword: string
) {
  console.log(newPassword, oldPassword);

  try {
    const res = await api.post(
      `/auth/update_password/`,
      { old_password: oldPassword, new_password: newPassword },
      {
        params: { username: currentUsername },
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { data, status } = error.response;

      console.error("Error updating username:", data);

      if (status === 400 && data.error) {
        toast.error(data.error);
      } else if (status === 400 && typeof data === "object") {
        Object.values(data).forEach((msg) => {
          if (typeof msg === "string") {
            toast.error(msg);
          } else if (Array.isArray(msg)) {
            msg.forEach((m) => toast.error(m));
          }
        });
      } else if (status === 403) {
        toast.error("You don't have permission to change this username.");
      } else if (status === 404) {
        toast.error("User not found.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } else {
      toast.error("Failed to update username due to an unknown error.");
    }

    throw error;
  }
}

//ULOAD AVATAR
export async function uploadAvatar(token: string, formData: FormData) {
  try {
    const res = await api.post(`/auth/upload_avatar/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.log("Failed to update avatar", error);
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error?.response?.data?.error || "Failed to update avatar";
      toast.error(errorMessage);
    } else {
      toast.error("Failed to update avatar");
    }
  }
}

//POSTS

//GET POSTS
export async function getPosts(limit = 10, page = 1) {
  try {
    const res = await api.get(`/posts/`, {
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

//GET POST
export async function getPost(id: string) {
  try {
    const res = await api.get(`/posts/${id}/`, {});
    console.log("Fetched posts:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return null;
  }
}

//CREATE POST
export async function createPost(token: string, data: FormData) {
  try {
    const res = await api.post(`/posts/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        "An unexpected error occurred while creating the post. Please try again later.";
      console.error("API Error:", errorMessage);
      toast.error(errorMessage);
    } else {
      console.error("General Error:", error);
      toast.error(
        "An unexpected error occurred while creating the post. Please try again later"
      );
    }
  }
}

//UPDATE POST
export async function updatePost(
  token: string,
  postId: string,
  data: FormData
) {
  try {
    const response = await axios.put(
      `${API_URL}/posts/${postId}/update_post/`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error updating post:", error.response?.data || error.message);
      throw error.response?.data || error.message;
    } else {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error updating post:", errorMessage);
      throw errorMessage;
    }
  }
}

//DELETE POST
export async function deletePost(token: string, postId: string) {
  try {
    const response = await axios.delete(
      `${API_URL}/posts/${postId}/delete_post/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  }  catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error updating post:", error.response?.data || error.message);
      throw error.response?.data || error.message;
    } else {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error updating post:", errorMessage);
      throw errorMessage;
    }
  }
}

//LIKE POST
export async function likePost(token: string, id: string) {
  try {
    const request = await api.post(
      `/posts/${id}/like/`,
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

//COMMENTS

//CREATE COMMENT
export async function createComment(itemId: string, comment: string) {
  try {
    const data = {
      text: comment,
      post: itemId,
    };
    const res = await api.post(`/comments/`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.log("Failed to update avatar", error);
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error?.response?.data?.error || "Failed to update avatar";
      toast.error(errorMessage);
    } else {
      toast.error("Failed to update avatar");
    }
  }
}

//LIKE COMMENT
export async function likeComment(token: string, id: string) {
  try {
    const request = await api.post(
      `/comments/${id}/like/`,
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

//UPDATE COMMENT
export async function updateComment(token: string, id: string, data: FormData) {
  try {
    const response = await axios.put(`${API_URL}/comments/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error updating post:", error.response?.data || error.message);
      throw error.response?.data || error.message;
    } else {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error updating post:", errorMessage);
      throw errorMessage;
    }
  }
}

//DELETE COMMENT
export async function deleteComment(token: string, id: string) {
  try {
    const response = await axios.delete(`${API_URL}/comments/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error updating post:", error.response?.data || error.message);
      throw error.response?.data || error.message;
    } else {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error updating post:", errorMessage);
      throw errorMessage;
    }
  }
}

//SEARCHING

//SEARCH
export async function searchQuery(query: string) {
  try {
    const response = await api.get(`/search/?search=${query}`, {});
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.log("Failed to search", error);
    throw error;
  }
}
