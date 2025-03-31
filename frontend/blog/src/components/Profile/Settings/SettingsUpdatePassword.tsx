"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { updatePassword } from "@/utils/api";
import { useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "sonner";

const SettingsUpdatePassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    reset,
  } = useForm();
  const router = useRouter();
  const { user } = useAuthStore();

  const onSubmit = async (data: FieldValues) => {
    if (!user) {
      toast.error("User is not available.");
      return;
    }

    try {
      await updatePassword(user?.username, data.newPassword, data.oldPassword);
      router.push("/");
      toast.success("Password was successfuly updated");
    } catch {}
    reset();
  };

  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-232px)]">
      <form
        className="flex flex-col gap-[50px] max-w-[400px] w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="relative block">
          <input
            {...register("oldPassword", {
              required: "Email is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            className="text-white p-4 rounded-lg w-full bg-black text-sm font-bold resize-none focus:outline-white focus:bg-opacity-90 focus:text-gray-300"
            type="password"
            placeholder="Old password"
          />
          {errors.oldPassword && (
            <p className="text-red-500">{`${errors.oldPassword.message}`}</p>
          )}
        </label>
        <label className="relative block">
          <input
            {...register("newPassword", {
              required: "Email is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            className="text-white p-4 rounded-lg w-full bg-black text-sm font-bold resize-none focus:outline-white focus:bg-opacity-90 focus:text-gray-300"
            type="password"
            placeholder="New password"
          />
          {errors.newPassword && (
            <p className="text-red-500">{`${errors.newPassword.message}`}</p>
          )}
        </label>
        <label className="relative block">
          <input
            {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: (value) =>
                value === getValues("newPassword") || "Password must match",
            })}
            className="text-white p-4 rounded-lg w-full bg-black text-sm font-bold resize-none focus:outline-white focus:bg-opacity-90 focus:text-gray-300"
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
          disabled={isSubmitting}
        >
          Update password
        </button>
      </form>
    </div>
  );
};

export default SettingsUpdatePassword;
