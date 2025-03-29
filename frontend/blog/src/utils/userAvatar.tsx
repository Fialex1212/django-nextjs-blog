import Image from "next/image";

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
}

export const getUserAvatar = (user: User) => {
  if (user?.avatar) {
    return (
      <Image
        className="rounded-full w-[40px] h-[40px] object-cover"
        src={user.avatar}
        alt={`avatar_of_${user.username}`}
        width={40}
        height={40}
      />
    );
  }

  return (
    <div className="w-[40px] h-[40px] bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-[20px]">
      {user?.username?.slice(0, 2).toUpperCase()}
    </div>
  );
};
