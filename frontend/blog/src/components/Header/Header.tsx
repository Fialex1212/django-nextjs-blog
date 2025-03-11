import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import SearchBar from "../SearchBar/SearchBar";

const Header = () => {
  const { user } = useAuthStore();
  const authorPhoto = user?.avatar
    ? `http://127.0.0.1:8000${user?.avatar}` //TODO fix avatar url
    : `https://ui-avatars.com/api/?name=${user?.username}&size=40`;

  return (
    <>
      <header className="container py-[20px] flex justify-between">
        <Link className="text-[32px]" href={"/"}>
          My Blog
        </Link>
        <SearchBar/>
        {user ? (
          <div className="user__interface flex gap-[40px] w-[115px]">
            <div className="avatar__wrapper">
              <Link href={`/profile/`}>
                <Image
                  src={authorPhoto}
                  alt={user?.username}
                  width={50}
                  height={50}
                  className="user__avatar rounded-[50px]"
                />
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <Link href={"login"}>Login</Link>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
