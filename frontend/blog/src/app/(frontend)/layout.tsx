"use client"
import { useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { loadUser, token, user, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) return <p>Загрузка...</p>;

  return <>{children}</>;
}

