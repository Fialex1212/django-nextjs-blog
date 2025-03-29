"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuthStore } from "../../store/useAuthStore";

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

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
