import { PostProps } from "@/types";
import { getPosts } from "@/utils/api";
import { create } from "zustand";

interface PostState {
  posts: PostProps[];
  loading: boolean;
  error: string | null;
  page: number;
  fetchPosts: () => Promise<void>;
  deletePostFromStore: (postId: string) => void;
}

export const usePostsStore = create<PostState>((set) => ({
  posts: [],
  loading: false,
  error: null,
  page: 1,
  fetchPosts: async (limit: number = 100, page: number = 1) => {
    set({ loading: true, error: null });
    try {
      const postsData = await getPosts(limit, page);
      console.log("Posts data in store:", postsData);
      if (postsData && postsData.results) {
        set(() => ({
          posts: postsData.results,
          loading: false,
          page: page + 1,
        }));
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.log("Error while fetching", error);
      if (error instanceof Error) {
        set({ loading: false, error: error.message });
      } else {
        set({ loading: false, error: "An unknown error occurred" });
      }
    }
  },
  deletePostFromStore: (postId: string) => {
    set((state) => ({
      posts: state.posts.filter((post) => post.id !== postId),
    }));
  },
}));
