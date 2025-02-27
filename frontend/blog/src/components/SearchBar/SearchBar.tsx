"use client";
import { useSearchStore } from "@/store/useSearchStore";
// import { useRouter } from "next/router";

const SearchBar = () => {
  const { query, setQuery, search, loading } = useSearchStore();
  // const router = useRouter();

  // const handleSearch = async () => {
  //   await search()
  //   if(router.pathname !== "/search"){
  //     router.push(`/search?query=${query}`)
  //   }
  // }

  return (
    <div className="flex gap-[20px]">
      <label>
        <input
          className="border-2 text-white border-gray-300 p-4 rounded-lg bg-black text-sm font-bold resize-none focus:outline-white focus:bg-opacity-90 focus:text-gray-300"
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      <button
        className="cursor-pointer group relative flex gap-1.5 px-6 py-4 bg-black bg-opacity-95 text-[#f1f1f1] rounded-xl hover:bg-opacity-85 transition font-semibold shadow-md"
        onClick={search}
        disabled={loading}
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
  );
};

export default SearchBar;
