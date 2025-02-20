"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { loginUser, getUser } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { toast } from "sonner";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await loginUser(username, password);
      const user = await getUser(data.access);
      login(data.access, user);
      router.push("/");
    } catch {
      toast.error("Error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl mb-20 text-[50px]">Login to you account</h2>
      <form className="flex flex-col gap-[50px]" onSubmit={handleLogin}>
        <label className="relative block">
          <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <input
            className="pl-8 border-b border-black-500 border-style: dashed"
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label className="relative block">
          <span className="cursor-auto absolute left-2 top-1/2 transform -translate-y-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M4 8V6a6 6 0 1112 0v2h1a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V9a1 1 0 011-1h1zm2-2v2h8V6a4 4 0 00-8 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>

          <input
            className="pl-8 border-b border-black-500 border-style: dashed"
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button className="mt-4 p-2 bg-green-500 text-white" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
