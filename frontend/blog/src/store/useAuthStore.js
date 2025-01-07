import { create } from "zustand";
import axios from "axios";
import api from "@/utils/api";

export const useAuthStore = create((set) => {
  return {
    isAuthenticated: false,
    isLoading: false,
    isPopup: false,
    setIsPopup: (value) =>
      set((state) => ({
        isPopup: value !== undefined ? value : !state.isPopup,
      })),
    login: async (data) => {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/auth/login/",
          data,
          {
            withCredentials: true,
          }
        );
        const { access_token, refresh_token } = response.data;
        set({
          isAuthenticated: true,
        });
        document.cookie = `access_token=${access_token}; path=/;`;
        document.cookie = `refresh_token=${refresh_token}; path=/;`;
        console.log('Login successful:', response.data);
        console.log(response.data);
      } catch (error) {
        throw error;
      }
    },
    logout: async () => {
      try {
        await axios.post("http://127.0.0.1:8000/api/auth/logout/", null, {
          withCredentials: true,
        });
        console.log(response.data);
      } catch (error) {
        throw error;
      }
    },
    register: async (data) => {
      set({ isLoading: true });
      console.log(data);
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/auth/register/",
          data
        );
        set({ isPopup: true });
        return response.data;
      } catch (error) {
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },
    codeSubmit: async (data) => {
      set({ isLoading: true });
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/auth/register/verify/",
          data
        );
      } catch (error) {
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },
    checkAuthStatus: async () => {
      try {
        const response = await api.get('/auth/check-auth-status/', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        set({ isAuthenticated: data.is_authenticated });
      } catch (error) {
        console.error("Error checking authentication status:", error);
      }
    },
  };
});
