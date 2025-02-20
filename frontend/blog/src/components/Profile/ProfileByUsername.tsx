"use client";

import { getUserDetail } from "@/utils/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface User {
  username: string;
  email: string;
}

const ProfileByUsername = ({ username }: { username: string }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
      <h1 className="text-2xl mb-4">Profile of {user.username}</h1>
      <p>Email: {user.email}</p>
      <p>Username: {user.username}</p>
    </div>
  );
};

export default ProfileByUsername;
