import { create } from "zustand";
import api from "@/utils/api";

export const usePostsStore = create((set) => {
  return {
    posts: [],
    fetchPosts: async () => {
      try {
        const response = await api.get("blog/posts/");
        const postsData = response.data;
        set({ posts: postsData });
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    },
  };
});
