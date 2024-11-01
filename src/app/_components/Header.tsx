"use client";
import Image from "next/image";
import { MenuModal } from "./MenuModal";
import { FiMenu } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { UserProps } from "../types/UserType";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<UserProps | null>(null); // user 상태 추가

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    router.push("/login");
  };
  // 컴포넌트가 마운트된 후에만 쿠키를 읽도록 수정
  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      setUser(JSON.parse(userCookie));
    }
  }, []);
  return (
    <>
      <header className="flex py-4 px-6 items-center justify-between fixed top-0 left-0 z-20 w-full bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 relative flex">
            <Image
              src="/imgs/hamberger.jpg"
              alt="로고"
              fill
              priority
              sizes="100%"
              className="rounded-lg"
            />
          </div>
          {user && (
            <span className="text-zinc-300 text-sm">{user.nickname}님</span>
          )}
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="w-10 h-10 flex items-center justify-center text-white hover:bg-zinc-800 rounded-lg transition-colors duration-200"
        >
          <FiMenu className="w-6 h-6" />
        </button>
      </header>

      <MenuModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        user={user}
        onLogout={handleLogout}
      />
    </>
  );
}
