"use client";
import Image from "next/image";
import { MenuModal } from "./MenuModal";
import { FiMenu } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { UserProps } from "../types/UserType";
import Link from "next/link";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<UserProps | null>(null); // user 상태 추가

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("로그아웃 실패");
      }

      // 쿠키 제거
      Cookies.remove("token");
      Cookies.remove("user");
      setUser(null);

      // 홈으로 리다이렉트
      router.push("/login");
    } catch (error) {
      console.error("로그아웃 에러:", error);
      // 에러가 발생해도 일단 로컬의 토큰은 제거
      Cookies.remove("token");
      Cookies.remove("user");
      setUser(null);
      router.push("/login");
    }
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
          <Link href="/" className="w-8 h-8 relative flex">
            <Image
              src="/imgs/hamberger.jpg"
              alt="로고"
              fill
              priority
              sizes="100%"
              className="rounded-lg"
            />
          </Link>
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
