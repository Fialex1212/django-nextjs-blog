import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import SearchBar from "../SearchBar";

const Header = () => {
  const { user } = useAuthStore();
  const userAvatar = user?.avatar ? (
    <Image
      className="rounded-full w-[50px] h-[50px] object-cover"
      src={`http://127.0.0.1:8000${user?.avatar}`}
      alt={`avatar_of_${user?.username}`}
      width={50}
      height={50}
    />
  ) : (
    <div className="w-[50px] h-[50px] bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-[70px] mb-[20px]">
      {user?.username.slice(0, 2).toUpperCase()}
    </div>
  );

  return (
    <>
      <header className="container py-[20px] flex justify-between">
        <Link className="text-[32px]" href={"/"}>
        Blog
        </Link>
        <SearchBar />
        {user ? (
          <div className="user__interface flex justify-end gap-[40px]">
            <div className="avatar__wrapper">
              <Link href={`/profile/you`}>{userAvatar}</Link>
            </div>
          </div>
        ) : (
          <div>
            <Link href={"/auth/login"}>Login</Link>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
