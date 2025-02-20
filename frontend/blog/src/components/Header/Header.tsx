import Image from "next/image";
import Link from "next/link";
import CreatePost from "../Post/CreatePost";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

const Header = () => {
  const { user } = useAuthStore();
  const authorPhoto = user?.avatar
    ? user?.avatar
    : `https://ui-avatars.com/api/?name=${user?.username}&size=40`;
  const [modalIsOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="container py-[20px] flex justify-between">
        <Link className="text-[32px]" href={"/"}>
          My Blog
        </Link>
        {user ? (
          <div className="user__interface flex gap-[40px]">
            <CreatePost modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} />
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
