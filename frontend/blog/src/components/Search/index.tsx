"use client";

import { useSearchStore } from "@/store/useSearchStore";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Tabs from "../Tabs";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ErrorMessage from "../ErrorMessage";
import Spinner from "../Spinner";

const Search = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const { result, error, loading, setQuery, search } = useSearchStore();
  const [selected, setSelected] = useState("All");
  const tabsOptions = ["All", "Users", "Posts"];

  useEffect(() => {
    if (query) {
      setQuery(query);
      search();
    }
  }, [query, setQuery, search]);

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="container min-h-[calc(100vh-236px)]">
      <h2 className="text-[50px] text-center mb-[20px]">Searching page</h2>

      <div className="flex justify-center">
        <Tabs
          selected={selected}
          setSelected={setSelected}
          tabsOptions={tabsOptions}
        />
      </div>

      <div className="mt-4">
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
                        {user?.avatar ? (
                          <Image
                            className="rounded-full w-[40px] h-[40px] object-cover"
                            src={user?.avatar}
                            alt={`avatar_of_${user?.username}`}
                            width={40}
                            height={40}
                          />
                        ) : (
                          <div className="w-[40px] h-[40px] bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-[20px]">
                            {user?.username.slice(0, 2).toUpperCase()}
                          </div>
                        )}
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
                <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {result.posts.map((post) => (
                    <li className="w-full" key={post.id}>
                      <Link
                        className="text-blue-500 hover:underline"
                        href={`/post/${post.id}`}
                      >
                        <div className="w-full h-[170px] overflow-hidden rounded-lg">
                          <Image
                            src={post.photo}
                            alt={post.text}
                            width={250}
                            height={250}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p>{post.text}</p>
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
      </div>
    </div>
  );
};

export default Search;
