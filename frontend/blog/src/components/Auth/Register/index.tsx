"use client";
import { registerUser } from "@/utils/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { toast } from "sonner";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm();
  const router = useRouter();

  const onSubmit = async (data: FieldValues) => {
    console.log(data.username, data.email, data.password);
    try {
      await registerUser(data.username, data.email, data.password);
      router.push("/auth/login");
    } catch {
      toast.error("Error");
    }
    reset();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-232px)]">
      <h2 className="text-2xl mb-20 text-[50px]">Create a new account</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-[50px] max-w-[400px] w-full"
      >
        <label className="relative block">
          <input
            {...register("username", {
              required: "Username is required",
            })}
            className="border-b border-black border-style: dashed w-full"
            placeholder="Username"
            aria-label="Username"
          />
          {errors.username && (
            <p className="text-red-500">{`${errors.username.message}`}</p>
          )}
        </label>
        <label className="relative block">
          <input
            {...register("email", { required: "Email is required" })}
            type="email"
            className="border-b border-black border-style: dashed w-full"
            required
            placeholder="Email"
            aria-label="Email"
          />
          {errors.email && (
            <p className="text-red-500">{`${errors.email.message}`}</p>
          )}
        </label>
        <label className="relative block">
          <input
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
            required
            type="password"
            placeholder="Password"
            aria-label="Password"
          />
          {errors.password && (
            <p className="text-red-500">{`${errors.password.message}`}</p>
          )}
        </label>
        <label className="relative block">
          <input
            {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: (value) =>
                value === getValues("password") || "Password must match",
            })}
            className="border-b border-black border-style: dashed w-full"
            required
            type="password"
            placeholder="Confirm Password"
          />
          {errors.confirmPassword && (
            <p className="text-red-500">{`${errors.confirmPassword.message}`}</p>
          )}
        </label>

        <button
          className="cursor-pointer group relative flex justify-center gap-1.5 px-6 py-4 bg-black bg-opacity-95 text-[#f1f1f1] rounded-xl hover:bg-opacity-85 transition font-semibold shadow-md"
          type="submit"
        >
          Register
        </button>
        <div className="flex justify-center gap-[10px] font-semibold">
          <p>Already have an account?</p>
          <Link className="text-blue-600 underline" href={"/auth/login"}>
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
