"use client";
import Link from "next/link";
import { IconType } from "react-icons";
import { motion } from "framer-motion";

interface GameCardProps {
  href: string;
  icon: IconType;
  title: string;
  description: string;
  delay: number;
}

export default function GameCard({
  href,
  icon: Icon,
  title,
  description,
  delay,
}: GameCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        href={href}
        className="group block relative overflow-hidden rounded-2xl transition-all duration-300"
      >
        {/* 배경 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 z-0" />

        {/* 호버 효과용 그라데이션 오버레이 */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-indigo-600/20 via-transparent to-transparent transition-all duration-300 z-10" />

        {/* 장식용 패턴 */}
        <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:24px_24px] z-20" />

        {/* 컨텐츠 */}
        <div className="relative h-full w-full p-8 flex flex-col items-center justify-center text-white z-30">
          {/* 아이콘 컨테이너 */}
          <div className="mb-6 p-4 rounded-xl bg-indigo-600/10 group-hover:bg-indigo-600/20 transition-all duration-300">
            <Icon className="text-5xl text-indigo-400 group-hover:text-indigo-300 transition-all duration-300 group-hover:scale-110" />
          </div>

          {/* 텍스트 컨텐츠 */}
          <div className="text-center space-y-3">
            <h3 className="text-2xl font-bold transition-transform duration-300 group-hover:translate-y-[-2px]">
              {title}
            </h3>
            <p className="text-sm text-zinc-400 group-hover:text-zinc-300 max-w-xs transition-all duration-300">
              {description}
            </p>
          </div>

          {/* 하단 액션 버튼 */}
          <div className="mt-6 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <span className="inline-flex items-center gap-2 text-sm text-indigo-400 group-hover:text-indigo-300 font-medium">
              시작하기
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </div>

          {/* 테두리 효과 */}
          <div className="absolute inset-0 rounded-2xl border border-zinc-700/50 group-hover:border-indigo-500/30 transition-colors duration-300" />
        </div>
      </Link>
    </motion.div>
  );
}
