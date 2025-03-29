import { searchQuery } from "@/utils/api";
import { create } from "zustand";

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

interface Post {
  id: string;
  author: User;
  text: string;
  photo: string;
  created_at: string;
  updated_at: string;
}

interface SearchState {
  query: string;
  result: { users: User[]; posts: Post[] };
  loading: boolean;
  error: string | null;
  setQuery: (query: string) => void;
  search: () => Promise<void>;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: "",
  result: { users: [], posts: [] },
  loading: false,
  error: null,
  setQuery: (query) => set({ query }),
  search: async () => {
    const { query } = get();
    if (!query.trim()) return;

    set({ loading: true, error: null });

    try {
      const data = await searchQuery(query);

      set({ result: data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch search results", loading: false });
      console.log(error);
    }
  },
}));
