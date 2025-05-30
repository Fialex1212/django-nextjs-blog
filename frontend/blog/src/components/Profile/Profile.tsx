"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import Image from "next/image";
import { Pencil } from "lucide-react";
import ProfileUpdateAvatar from "./ProfileUpdateAvatar";
import Link from "next/link";

const Profile = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = useCallback(() => {
    logout();
    router.push("/auth/login");
  }, [logout, router]);

  const handleChangeAvatar = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const userAvatar = user?.avatar ? (
    <Image
      className="rounded-full w-[200px] h-[200px] object-cover"
      src={`http://127.0.0.1:8000${user?.avatar}`}
      alt="user_avatar"
      width={200}
      height={200}
    />
  ) : (
    <div className="w-[200px] h-[200px] bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-[70px] mb-[20px]">
      {user?.username.slice(0, 2).toUpperCase()}
    </div>
  ); //TODO fix avatar url

  return (
    <div className="flex flex-col items-center justify-center pt-[50px] min-h-[calc(100vh-236px)]">
      <div className="user flex flex-col items-center mb-[50px]">
        <div className="group relative mb-[20px]">
          {userAvatar}
          <button
            onClick={handleChangeAvatar}
            className="absolute right-1 bottom-1 mb-2 mr-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-200 w-[40px] h-[40px] rounded-full flex justify-center items-center"
          >
            <Pencil />
          </button>
        </div>
        <h3 className="user__email text-[22px]">{user?.email}</h3>
        <h3 className="user__username text-[22px]">{user?.username}</h3>
      </div>
      <ProfileUpdateAvatar
        isModalOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
      />

      <div className="flex flex-col gap-4">
        <Link
          href={"/post/create"}
          className="cursor-pointer group relative flex justify-center gap-1.5 px-8 py-4 bg-black bg-opacity-95 text-[#f1f1f1] rounded-xl hover:bg-opacity-85 transition font-semibold shadow-md"
        >
          Create a post
        </Link>
        <Link
          href={"/profile/you/settings"}
          className="cursor-pointer group relative flex justify-center gap-1.5 px-8 py-4 bg-black bg-opacity-95 text-[#f1f1f1] rounded-xl hover:bg-opacity-85 transition font-semibold shadow-md"
        >
          Settings
        </Link>
        <button
          onClick={handleLogout}
          className="cursor-pointer group relative flex justify-center gap-1.5 px-8 py-4 bg-red-500 bg-opacity-95 w-[160px] text-white rounded-xl hover:bg-opacity-85 transition font-semibold shadow-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
