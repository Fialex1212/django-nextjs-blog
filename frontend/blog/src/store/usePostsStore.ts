import { getPosts } from "@/utils/api";
import { create } from "zustand";

interface User {
  id: string;
  username: string;
  email: string;
}

interface Post {
  id: string;
  author: User;
  text: string;
  photo: string;
  created_at: string;
  updated_at: string;
}

interface PostState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
}

export const usePostsStore = create<PostState>((set) => {
  return {
    posts: [],
    loading: false,
    error: null,
    fetchPosts: async () => {
      set({ loading: true, error: null });
      try {
        const postsData = await getPosts();
        set({ posts: postsData, loading: false });
      } catch (error) {
        console.log("Error while fething", error);
        if (error instanceof Error) {
          set({ loading: false, error: error.message });
        } else {
          set({ loading: false, error: "An unknown error occurred" });
        }
      }
    },
  };
});
