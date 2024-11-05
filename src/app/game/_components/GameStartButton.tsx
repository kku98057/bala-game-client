"use client";
import { motion } from "framer-motion";
import { MouseEvent } from "react";
import { FiPlay } from "react-icons/fi";

type GameStartButtonProps = {
  isPending: boolean;
  handleStart: () => void;
};
export default function GameStartButton({
  isPending,
  handleStart,
}: {
  isPending: boolean;
  handleStart: (e: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <motion.button
      type="button"
      disabled={isPending}
      onClick={handleStart}
      className="group relative w-full flex items-center justify-center py-4 px-6 bg-gradient-to-br from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 rounded-xl text-white font-medium transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      {/* 배경 효과 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

      {/* 아이콘 */}
      <FiPlay className="text-lg mr-2" />

      {/* 텍스트 */}
      <span className="text-base font-medium">
        {isPending ? (
          <span className="inline-flex items-center">
            시작중
            <span className="ml-2 flex space-x-1">
              <span className="animate-bounce delay-100">.</span>
              <span className="animate-bounce delay-200">.</span>
              <span className="animate-bounce delay-300">.</span>
            </span>
          </span>
        ) : (
          "시작하기"
        )}
      </span>

      {/* 테두리 효과 */}
      <div className="absolute inset-0 rounded-xl border-2 border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-105 group-hover:scale-100" />

      {/* 호버 시 빛나는 효과 */}
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-1000 group-hover:duration-200" />
    </motion.button>
  );
}
