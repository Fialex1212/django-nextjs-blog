import { create } from "zustand";
import axios from "axios";

export const useAuthStore = create((set) => {
  const storedUser = localStorage.getItem("userData");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;

  return {
    user: parsedUser,
    isAuthenticated: parsedUser !== null,
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
        console.log(response.data);
        const { user } = response.data;
        if (user) {
          localStorage.setItem("userData", JSON.stringify(user));
          set({ user, isAuthenticated: true });
        }
      } catch (error) {
        throw error;
      }
    },
    logout: async () => {
      try {
        await axios.post("http://127.0.0.1:8000/api/auth/logout/", null, {
          withCredentials: true,
        });
        localStorage.removeItem("userData");
        set({ user: null, isAuthenticated: false });
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
  };
});
