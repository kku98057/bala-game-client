"use client";
import Image from "next/image";
import { MenuModal } from "./MenuModal";
import { FiMenu } from "react-icons/fi";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="flex py-4 px-6 items-center justify-between fixed top-0 left-0 z-20 w-full bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800">
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

        <button
          onClick={() => setIsOpen(true)}
          className="w-10 h-10 flex items-center justify-center text-white hover:bg-zinc-800 rounded-lg transition-colors duration-200"
        >
          <FiMenu className="w-6 h-6" />
        </button>
      </header>

      <MenuModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
