"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { loginUser, getUser } from "@/utils/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import Link from "next/link";
import { useEffect } from "react";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();
  const router = useRouter();
  const { login, loginWithGoogle } = useAuthStore();

  useEffect(() => {
    // Проверяем, есть ли Google-токен в URL (после редиректа)
    const urlParams = new URLSearchParams(window.location.search);
    const googleToken = urlParams.get("token");
    if (googleToken) {
      loginWithGoogle(googleToken);
      window.history.replaceState(null, "", window.location.pathname); // Убираем токен из URL
    }
  }, [loginWithGoogle]);

  const onSubmit = async (data: FieldValues) => {
    console.log(data.username, data.password);
    try {
      const userData = await loginUser(data.username, data.password);
      const user = await getUser();
      console.log("Refresh token: ", userData.refresh);
      console.log("Access token: ", userData.access);

      login(userData.access, userData.refresh, user);
      router.push("/");
    } catch {
      toast.error("Error");
    }
    reset();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-232px)]">
      <h2 className="text-2xl mb-20 text-[50px]">Login to you account</h2>
      <form
        className="flex flex-col gap-[50px] max-w-[400px] w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="relative block">
          <input
            {...register("username", { required: "Username is required" })}
            className="border-b border-black-500 border-style: dashed w-full"
            type="text"
            placeholder="Username"
          />
          {errors.username && (
            <p className="text-red-500">{`${errors.username.message}`}</p>
          )}
        </label>
        <label className="relative block">
          <input
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters",
              },
              maxLength: {
                value: 23,
                message: "Username must not exceed 23 characters",
              },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message:
                  "Username can only contain letters, numbers, and underscores",
              },
            })}
            className="border-b border-black-500 border-style: dashed w-full"
            type="password"
            placeholder="Password"
          />
          {errors.password && (
            <p className="text-red-500">{`${errors.password.message}`}</p>
          )}
        </label>
        <button
          className="cursor-pointer group relative flex justify-center gap-1.5 px-6 py-4 bg-black bg-opacity-95 text-[#f1f1f1] rounded-xl hover:bg-opacity-85 transition font-semibold shadow-md"
          type="submit"
          disabled={isSubmitting}
        >
          Login
        </button>
        <button
          className="cursor-pointer group relative flex justify-center gap-1.5 px-6 py-4 bg-black bg-opacity-95 text-[#f1f1f1] rounded-xl hover:bg-opacity-85 transition font-semibold shadow-md"
          type="submit"
          disabled={isSubmitting}
        >
          <Link href="http://localhost:8000/api/auth/google/login/">
            Войти через Google
          </Link>
        </button>
        <div className="flex justify-center gap-[10px] font-semibold">
          <p>Do not have an account?</p>
          <Link className="text-blue-600 underline" href={"/auth/register"}>
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
