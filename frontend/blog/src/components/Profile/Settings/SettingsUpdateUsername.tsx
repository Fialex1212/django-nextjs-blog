"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { updateUsername } from "@/utils/api";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "sonner";

const SettingsUpdateUsername = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm();
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.username) {
      setValue("username", user.username);
    }
  }, [user, setValue]);

  const onSubmit = async (data: FieldValues) => {
    console.log(data.username);

    if (data.username === user?.username) {
      toast.info("It's your current username");
      return;
    }

    if (!user?.username) {
      toast.error("User's current username is not available.");
      return;
    }

    try {
      await updateUsername(user?.username, data.username);
      router.push("/");
      toast.success("Username was successfuly updated")
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
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters",
              },
              maxLength: {
                value: 23,
                message: "Username must not exceed 23 characters",
              },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/, // Username with only alphanumeric characters and underscores
                message:
                  "Username can only contain letters, numbers, and underscores",
              },
            })}
            className="border-b border-black-500 border-style: dashed w-full"
            type="text"
            placeholder="Username"
          />
          {errors.username && (
            <p className="text-red-500">{`${errors.username.message}`}</p>
          )}
        </label>
        <button
          className="cursor-pointer group relative flex justify-center gap-1.5 px-6 py-4 bg-black bg-opacity-95 text-[#f1f1f1] rounded-xl hover:bg-opacity-85 transition font-semibold shadow-md"
          type="submit"
          disabled={isSubmitting}
        >
          Update username
        </button>
      </form>
    </div>
  );
};

export default SettingsUpdateUsername;
