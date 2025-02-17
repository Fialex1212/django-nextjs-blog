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
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: Cookies.get("token") || null,
  loading: true,
  login: (token, user) => {
    Cookies.set("token", token, { expires: 7 });
    set({ token, user, loading: false });
  },
  logout: () => {
    Cookies.remove("token");
    set({ token: null, user: null, loading: false });
  },
  loadUser: async () => {
    const token = Cookies.get("token");
    if (!token) {
      set({ loading: false });
      return;
    }

    try {
      const user = await getUser(token);
      set({ user, loading: false });
    } catch (error) {
      console.error("Ошибка загрузки пользователя:", error);
      Cookies.remove("token");
      set({ token: null, user: null, loading: false });
    }
  },
}));
