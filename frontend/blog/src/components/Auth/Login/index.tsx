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
    const urlParams = new URLSearchParams(window.location.search);
    const googleToken = urlParams.get("token");
    if (googleToken) {
      loginWithGoogle(googleToken);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [loginWithGoogle]);

  const onSubmit = async (data: FieldValues) => {
    console.log(data.username, data.password);
    try {
      const userData = await loginUser(data.username, data.password);
      const user = await getUser();
      if (process.env.NODE_ENV === "development") {
        console.debug("Refresh token: ", userData.refresh);
        console.debug("Access token: ", userData.access);
      }
      login(userData.access, userData.refresh, user);
      router.push("/");
      reset();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to login. Please check your credentials.";
      toast.error(errorMessage);
    }
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
            id="username"
            {...register("username", { required: "Username is required" })}
            className="border-b border-black border-style: dashed w-full"
            type="text"
            placeholder="Username"
            aria-label="Username"
          />
          {errors.username && (
            <p className="text-red-500">{`${errors.username.message}`}</p>
          )}
        </label>
        <label className="relative block">
          <input
            id="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              maxLength: {
                value: 23,
                message: "Password must not exceed 23 characters",
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
                message:
                  "Password must contain at least one uppercase letter, one lowercase letter, and one number",
              },
            })}
            className="border-b border-black border-style: dashed w-full"
            type="password"
            placeholder="Password"
            aria-label="Password"
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
