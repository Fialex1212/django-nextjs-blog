import { create } from "zustand";
import Cookies from "js-cookie";
import { getUser, loginWithGoogle } from "../utils/api";
import { UserProps } from "@/types";

interface AuthState {
  user: UserProps | null;
  token: string | null;
  refresh_token: string | null;
  rewriteToken: (token: string) => void;
  rewriteRefreshToken: (refresh_token: string) => void;
  loading: boolean;
  login: (token: string, refresh_token: string, user: UserProps) => void;
  logout: () => void;
  loadUser: () => Promise<void>;
  loginWithGoogle: (googleToken: string) => Promise<void>;
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
    console.log("loadUser started, loading:", true);
    const token = Cookies.get("accessToken");
    if (!token) {
      console.log("No token, setting loading false");
      set({ loading: false });
      return;
    }

    set({ loading: true });
    try {
      console.log("Fetching user...");
      const user = await getUser();
      console.log("User fetched:", user);
      if (!user) throw new Error("No user data returned");
      set({ user, loading: false });
      console.log("User set, loading false");
    } catch (error) {
      console.error("Failed to fetch user:", error);
      Cookies.remove("refreshToken");
      Cookies.remove("accessToken");
      set({ token: null, user: null, loading: false });
      console.log("Error handled, loading false");
    }
  },
  loginWithGoogle: async (googleToken) => {
    try {
      const response = await loginWithGoogle(googleToken);
      if (!response) throw new Error("Google login failed");
      const { access, refresh, user } = response;

      Cookies.set("accessToken", access, { expires: 7 });
      Cookies.set("refreshToken", refresh, { expires: 7 });

      set({ token: access, refresh_token: refresh, user, loading: false });
      console.log("Auth store:", useAuthStore.getState());
    } catch (error) {
      console.error("Google login failed:", error);
      set({ token: null, user: null, loading: false });
    }
  },
}));
