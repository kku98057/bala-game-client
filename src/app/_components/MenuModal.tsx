"use client";

import { useRef, useState, useEffect } from "react";
import {
  FiX,
  FiHome,
  FiList,
  FiUser,
  FiLogIn,
  FiLogOut,
  FiBell,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { UserProps } from "../types/UserType";
import Cookies from "js-cookie";

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProps | null;
  onLogout: () => void;
}

export const MenuModal = ({
  isOpen,
  onClose,
  user,
  onLogout,
}: MenuModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 기본 메뉴 아이템
  const baseMenuItems = [
    { icon: <FiHome />, label: "홈", href: "/" },
    { icon: <FiBell />, label: "공지사항", href: "/notice" },
    { icon: <FiList />, label: "게임 목록", href: "/game" },
  ];

  // 로그인 상태에 따른 메뉴 아이템
  const menuItems = mounted
    ? [
        ...baseMenuItems,
        ...(Cookies.get("token")
          ? [{ icon: <FiUser />, label: "프로필", href: "/profile" }]
          : []),
      ]
    : baseMenuItems;

  // 인증 관련 메뉴 아이템
  const authItems = mounted
    ? Cookies.get("token")
      ? [
          {
            icon: <FiLogOut />,
            label: "로그아웃",
            href: "#",
            onClick: onLogout,
          },
        ]
      : [
          {
            icon: <FiLogIn />,
            label: "로그인",
            href: "/login",
            onClick: onClose,
          },
        ]
    : [];

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-end"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full max-w-md h-full bg-zinc-900 shadow-xl p-6 relative"
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

            <nav className="space-y-6">
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

              <div className="border-t border-zinc-800"></div>

              <ul className="space-y-2">
                {authItems.map((item) => (
                  <li key={item.label}>
                    {item.href === "#" ? (
                      <button
                        onClick={item.onClick}
                        className="w-full flex items-center px-4 py-3 text-white hover:bg-zinc-800 rounded-lg transition-colors duration-200 group"
                      >
                        <span className="w-8 h-8 flex items-center justify-center text-xl text-red-400 group-hover:text-red-300">
                          {item.icon}
                        </span>
                        <span className="ml-3 text-lg">{item.label}</span>
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className="flex items-center px-4 py-3 text-white hover:bg-zinc-800 rounded-lg transition-colors duration-200 group"
                        onClick={item.onClick}
                      >
                        <span className="w-8 h-8 flex items-center justify-center text-xl text-indigo-400 group-hover:text-indigo-300">
                          {item.icon}
                        </span>
                        <span className="ml-3 text-lg">{item.label}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="absolute bottom-8 left-6 right-6">
              <div className="p-4 bg-zinc-800 rounded-xl">
                <p className="text-zinc-400 text-sm text-center">
                  밸런썸 v1.1.0
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
