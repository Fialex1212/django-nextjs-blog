import { create } from "zustand";
import Cookies from "js-cookie";
import { getUser } from "../utils/api";

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refresh_token: string | null;
  rewriteToken: (token: string) => void;
  rewriteRefreshToken: (refresh_token: string) => void;
  loading: boolean;
  login: (token: string, refresh_token: string, user: User) => void;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: Cookies.get("accessToken") || null,
  refresh_token: Cookies.get("refreshToken") || null,
  rewriteToken: (token) => {
    Cookies.set("accessToken", token, { expires: 7 });
    set({ token });
  },
  rewriteRefreshToken: (refresh_token) => {
    Cookies.set("refreshToken", refresh_token, { expires: 7 });
    set({ refresh_token });
  },
  loading: true,
  login: (token, refresh_token, user) => {
    Cookies.set("accessToken", token, { expires: 7 });
    Cookies.set("refreshToken", refresh_token, { expires: 7 });
    set({ token, refresh_token, user, loading: false });
  },
  logout: () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    set({ token: null, user: null, loading: false });
  },
  loadUser: async () => {
    const token = Cookies.get("accessToken");
    if (!token) {
      set({ loading: false });
      return;
    }

    try {
      const user = await getUser();
      set({ user, loading: false });
    } catch (error) {
      console.error("Failed to fetch user:", error);
      Cookies.remove("refreshToken");
      Cookies.remove("accessToken");
      set({ token: null, user: null, loading: false });
    }
  },
}));
