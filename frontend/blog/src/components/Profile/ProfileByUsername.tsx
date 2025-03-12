"use client";

import { getUserDetail } from "@/utils/api";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface User {
  username: string;
  email: string;
  avatar: string;
}

const ProfileByUsername = ({ username }: { username: string }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await getUserDetail(username);
        if (data) {
          setUser(data);
        } else {
          toast.error("User not found");
        }
      } catch {
        toast.error("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchUser();
  }, [username]);

  if (loading) return <p className="text-center">Loading user profile...</p>;

  if (!user) return <p className="text-center text-red-500">User not found</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="user flex flex-col items-center mb-[50px]">
        {userAvatar}
        <h3 className="user__email text-[22px]">{user?.email}</h3>
        <h3 className="user__username text-[22px]">{user?.username}</h3>
      </div>
    </div>
  );
};

export default ProfileByUsername;
