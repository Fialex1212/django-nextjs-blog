"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Profile = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  useEffect(() => {
    console.log(user);
  });

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  return (
    <div className="flex flex-col items-center justify-center pt-[50px]">
      <div className="user flex flex-col items-center mb-[50px]">
        <div className="w-[200px] h-[200px] bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-[70px] mb-[20px]">
          {user?.username.slice(0, 2).toUpperCase()}
        </div>
        <h3 className="user__email text-[22px]">{user?.email}</h3>
        <h3 className="user__username text-[22px]">{user?.username}</h3>
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => {
            router.push("/post/create");
          }}
          className="cursor-pointer group relative flex gap-1.5 px-8 py-4 bg-black bg-opacity-95 text-[#f1f1f1] rounded-xl hover:bg-opacity-85 transition font-semibold shadow-md"
        >
          Create a post
        </button>
        <button
          onClick={handleLogout}
          className="cursor-pointer group relative gap-1.5 px-8 py-4 bg-red-500 bg-opacity-95 w-[160px] flex justify-center text-white rounded-xl hover:bg-opacity-85 transition font-semibold shadow-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
