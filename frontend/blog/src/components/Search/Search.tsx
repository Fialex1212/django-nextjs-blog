"use client";

import { useSearchStore } from "@/store/useSearchStore";
import SearchBar from "../SearchBar/SearchBar";
import Tabs from "../Tabs/Tabs";
import { useState } from "react";
import Link from "next/link";

const Search = () => {
  const { result, error, loading } = useSearchStore();
  const [selected, setSelected] = useState("All");

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="container">
      <h2>Searching page</h2>

      <div className="flex justify-center">
        <SearchBar />
      </div>

      <div className="flex justify-center">
        <Tabs selected={selected} setSelected={setSelected} />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        {selected === "All" || selected === "Users" ? (
          <>
            <h2>Users</h2>
            {result.users.length > 0 ? (
              <ul className="flex w-full">
                {result.users.map((user) => (
                  <li className="w-full" key={user.id}>
                    <Link
                      className="flex items-center gap-[20px]"
                      href={`/profile/${user.username}`}
                    >
                      <div className="w-[40px] h-[40px] bg-gray-400 rounded-[50px] flex items-center justify-center text-white font-bold">
                        {user.username.slice(0, 2).toUpperCase()}
                      </div>
                      {user.username} - {user.email}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No users found</p>
            )}
          </>
        ) : null}

        {selected === "All" || selected === "Posts" ? (
          <>
            <h2>Posts</h2>
            {result.posts.length > 0 ? (
              <ul>
                {result.posts.map((post) => (
                  <li key={post.id}>
                    <Link href={""}>{post.text}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No posts found</p>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Search;
