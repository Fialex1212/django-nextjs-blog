"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { updateEmail } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "sonner";

const SettingsUpdateEmail = () => {
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
    if (user?.email) {
      setValue("email", user.email);
    }
  }, [user, setValue]);

  const onSubmit = async (data: FieldValues) => {
    console.log(data.email);

    if (data.email === user?.email) {
      toast.info("It's your current email");
      return;
    }

    if (!user?.email) {
      toast.error("User's current email is not available.");
      return;
    }

    try {
      await updateEmail(user?.username, data.email);
      router.push("/");
      toast.success("Email was successfuly updated");
    } catch {}
    reset();
  };

  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-232px)]">
      <form
        className="flex flex-col gap-[50px] max-w-[400px] w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="relative block mb-[20px]">
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Please enter a valid email address",
              },
            })}
            className="text-white p-4 rounded-lg w-full bg-black text-sm font-bold resize-none focus:outline-white focus:bg-opacity-90 focus:text-gray-300"
            type="email"
            placeholder="Email"
          />
          {errors.email && (
            <p className="text-red-500">{`${errors.email.message}`}</p>
          )}
        </label>
        <button
          className="cursor-pointer group relative flex justify-center gap-1.5 px-6 py-4 bg-black bg-opacity-95 text-[#f1f1f1] rounded-xl hover:bg-opacity-85 transition font-semibold shadow-md"
          type="submit"
          disabled={isSubmitting}
        >
          Update email
        </button>
      </form>
    </div>
  );
};

export default SettingsUpdateEmail;
