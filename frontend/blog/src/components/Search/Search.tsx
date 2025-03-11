"use client";

import { useSearchStore } from "@/store/useSearchStore";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Tabs from "../Tabs/Tabs";
import { useState } from "react";
import Link from "next/link";

const Search = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const { result, error, loading, setQuery, search } = useSearchStore();
  const [selected, setSelected] = useState("All");

  useEffect(() => {
    if (query) {
      setQuery(query);
      search();
    }
  }, [query, setQuery, search]);


  return (
    <div className="container">
      <h2>Searching page</h2>

      <div className="flex justify-center">
        <Tabs selected={selected} setSelected={setSelected} />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-4">
        {loading ? (
          <p className="text-center text-lg font-semibold">
            Loading results...
          </p>
        ) : (
          <>
            {["All", "Users"].includes(selected) && (
              <>
                <h2>Users</h2>
                {result.users.length > 0 ? (
                  <ul className="flex w-full flex-wrap gap-4">
                    {result.users.map((user) => (
                      <li key={user.id} className="w-full">
                        <Link
                          className="flex items-center gap-4"
                          href={`/profile/${user.username}`}
                        >
                          <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                            {user.username.slice(0, 2).toUpperCase()}
                          </div>
                          <span>
                            {user.username} - {user.email}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No users found</p>
                )}
              </>
            )}

            {["All", "Posts"].includes(selected) && (
              <>
                <h2>Posts</h2>
                {result.posts.length > 0 ? (
                  <ul className="space-y-2">
                    {result.posts.map((post) => (
                      <li key={post.id}>
                        <Link
                          className="text-blue-500 hover:underline"
                          href={`/post/${post.id}`}
                        >
                          {post.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No posts found</p>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
