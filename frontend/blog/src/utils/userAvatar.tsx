import Image from "next/image";

interface Author {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

export const getUserAvatar = (author: Author) => {
  if (author?.avatar) {
    return (
      <Image
        className="rounded-full w-[40px] h-[40px] object-cover"
        src={author.avatar}
        alt={`avatar_of_${author.username}`}
        width={40}
        height={40}
      />
    );
  }

  return (
    <div className="w-[40px] h-[40px] bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-[20px]">
      {author?.username?.slice(0, 2).toUpperCase()}
    </div>
  );
};
