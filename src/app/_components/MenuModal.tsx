"use client";

import { useEffect, useRef } from "react";
import { FiX, FiHome, FiList, FiAward, FiInfo } from "react-icons/fi";
import gsap from "gsap";
import Link from "next/link";

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: <FiHome />, label: "홈", href: "/" },
  { icon: <FiList />, label: "게임 목록", href: "/games" },
  { icon: <FiAward />, label: "랭킹", href: "/ranking" },
  { icon: <FiInfo />, label: "게임 소개", href: "/about" },
];

export const MenuModal = ({ isOpen, onClose }: MenuModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // 모달 열기 애니메이션
      const tl = gsap.timeline();

      gsap.set(modalRef.current, { display: "flex" });
      gsap.set(menuRef.current, { x: "100%" });

      tl.to(modalRef.current, {
        opacity: 1,
        duration: 0.3,
      }).to(menuRef.current, {
        x: "0%",
        duration: 0.5,
        ease: "power3.out",
      });
    } else {
      // 모달 닫기 애니메이션
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(modalRef.current, { display: "none" });
        },
      });

      tl.to(menuRef.current, {
        x: "100%",
        duration: 0.5,
        ease: "power3.in",
      }).to(modalRef.current, {
        opacity: 0,
        duration: 0.3,
      });
    }
  }, [isOpen]);

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm items-center justify-end hidden opacity-0"
      onClick={onClose}
    >
      <div
        ref={menuRef}
        className="w-full max-w-md h-full bg-zinc-900 shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">메뉴</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-white hover:bg-zinc-800 rounded-lg transition-colors duration-200"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center px-4 py-3 text-white hover:bg-zinc-800 rounded-lg transition-colors duration-200 group"
                  onClick={onClose}
                >
                  <span className="w-8 h-8 flex items-center justify-center text-xl text-indigo-400 group-hover:text-indigo-300">
                    {item.icon}
                  </span>
                  <span className="ml-3 text-lg">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-8 left-6 right-6">
          <div className="p-4 bg-zinc-800 rounded-xl">
            <p className="text-zinc-400 text-sm text-center">
              밸런스 게임 v1.0.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};