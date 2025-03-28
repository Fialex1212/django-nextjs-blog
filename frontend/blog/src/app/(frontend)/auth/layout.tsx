"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, loadUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      // Load user data if not already loaded
      if (!user && !loading) {
        await loadUser();
      }

      // After loading, if user exists, redirect to home
      if (!loading && user) {
        router.push("/");
      }
    };

    checkUser();
  }, [loadUser, user, loading, router]);
  return <>{children}</>;
}