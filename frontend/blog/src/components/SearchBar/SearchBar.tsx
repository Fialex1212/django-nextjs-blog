"use client";

import { useSearchStore } from "@/store/useSearchStore";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useDebounce } from "use-debounce";

const SearchBar = () => {
  const { query, setQuery, search } = useSearchStore();
  const router = useRouter();
  const [debouncedQuery] = useDebounce(query, 300);

  const handleSearch = useCallback(
    async (e?: React.FormEvent<HTMLFormElement>) => {
      if (e) e.preventDefault();

      if (!query.trim()) return;

      await search();
      router.push(`/search?q=${encodeURIComponent(query)}`);
    },
    [query, search, router]
  );

  useEffect(() => {
    if (debouncedQuery.trim()) {
      handleSearch();
    }
  }, [debouncedQuery, handleSearch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-[20px]">
      <label>
        <input
          id="search-input"
          className="text-white p-4 rounded-lg bg-black text-sm font-bold resize-none focus:outline-white focus:bg-opacity-90 focus:text-gray-300"
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Search"
        />
      </label>
    </form>
  );
};

export default SearchBar;
