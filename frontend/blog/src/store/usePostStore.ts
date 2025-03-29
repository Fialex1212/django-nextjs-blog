import { create } from "zustand";
import { getPost } from "@/utils/api";

interface Author {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
}

interface Comment {
  id: string;
  author: Author;
  text: string;
  created_at: string;
  count_likes: number;
  is_liked: boolean;
}

interface Post {
  id: string;
  author: Author;
  text: string;
  photo: string;
  comments: Comment[];
  created_at: string;
  count_likes: number;
  is_liked: boolean;
}

interface PostState {
  post: Post | null;
  loading: boolean;
  error: string | null;
  fetchPost: (postId: string | string[] | undefined) => Promise<void>;
}

export const usePostStore = create<PostState>((set) => ({
  post: null,
  loading: false,
  error: null,
  fetchPost: async (postId) => {
    if (!postId) return;

    set({ loading: true, error: null });

    try {
      const id = Array.isArray(postId) ? postId[0] : postId;
      console.log("Fetching post with ID:", id);
      const data = await getPost(id);
      console.log("Received post data:", data);
      set({ post: data, loading: false });
    } catch (err: unknown) {
      console.error("Error fetching post:", err);
      const errorMessage =
        err instanceof Error ? err.message || "Failed to fetch post" : "Unknown error occurred";
      set({ error: errorMessage, loading: false });
    }
  },
}));