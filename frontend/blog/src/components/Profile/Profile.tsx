"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Profile = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Добро пожаловать, {user?.username}!</h1>
      <p>Email: {user?.email}</p>
      <p>Username: {user?.username}</p>
      <button
        className="mt-4 p-2 bg-red-500 text-white"
        onClick={() => {
          logout();
          router.push("/login");
        }}
      >
        Выйти
      </button>
    </div>
  );
};

export default Profile;
