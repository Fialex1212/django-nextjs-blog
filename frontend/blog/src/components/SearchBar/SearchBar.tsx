"use client";

import { useSearchStore } from "@/store/useSearchStore";
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const { query, setQuery, search } = useSearchStore();
  const router = useRouter();

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!query.trim()) return;

    await search();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-[20px]">
      <label>
        <input
          className="text-white p-4 rounded-lg bg-black text-sm font-bold resize-none focus:outline-white focus:bg-opacity-90 focus:text-gray-300"
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      {/* <button
        type="submit"
        className="cursor-pointer group relative flex gap-1.5 px-6 py-4 bg-black bg-opacity-95 text-[#f1f1f1] rounded-xl hover:bg-opacity-85 transition font-semibold shadow-md"
        disabled={loading}
      >
        {loading ? "Searching..." : "Search"}
      </button> */}
    </form>
  );
};

export default SearchBar;
