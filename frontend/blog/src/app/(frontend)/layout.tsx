"use client";
import { useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useRouter } from "next/navigation";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { loadUser, user, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <>
        <Header />
        <p>Загрузка...</p>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
