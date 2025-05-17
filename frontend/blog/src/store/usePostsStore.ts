import { PostProps } from "@/types";
import { getPosts } from "@/utils/api";
import { create } from "zustand";

interface PostState {
  posts: PostProps[];
  loading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  fetchPosts: () => Promise<void>;
  deletePostFromStore: (postId: string) => void;
}

export const usePostsStore = create<PostState>((set) => ({
  posts: [],
  loading: false,
  error: null,
  page: 1,
  hasMore: true,
  fetchPosts: async (limit: number = 10) => {
    const { page, hasMore, loading } = usePostsStore.getState();
    if (!hasMore || loading) return;

    set({ loading: true, error: null });
    try {
      const postsData = await getPosts(limit, page);
      const newPosts = postsData?.results ?? [];
      // console.log("Posts data in store:", postsData);

      if (postsData && postsData.results) {
        set((state) => ({
          posts: [...state.posts, ...newPosts],
          loading: false,
          page: state.page + 1,
          hasMore: newPosts.length === limit,
        }));
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error("Error while fetching", error);
      set({ loading: false, hasMore: false });
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
