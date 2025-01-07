import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { checkAuthStatus, isAuthenticated } = useAuthStore();

    if (error.response.status === 401) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        if (!isAuthenticated) {
          try {
            await checkAuthStatus();
            if (isAuthenticated) {
              return api(originalRequest);
            } else {
              console.error("User is not authenticated");
            }
          } catch (err) {
            console.error(
              "Error refreshing token or checking auth status",
              err
            );
          }
        } else {
          try {
            const refreshResponse = await api.post(
              "/auth/refresh-token/",
              null,
              {
                withCredentials: true,
              }
            );
            if (refreshResponse.status === 200) {
              return api(originalRequest);
            }
          } catch (refreshError) {
            console.error("Refresh token expired or invalid", refreshError);
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
