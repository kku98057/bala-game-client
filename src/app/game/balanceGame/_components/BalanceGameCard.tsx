import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { TournamentList } from "@/app/types/gameType";
import { BalanceGameListProps } from "@/app/types/balanceGameType";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBalaceGameData } from "../_lib/deleteBalaceGameData";
import { QUERYKEYS } from "@/queryKeys";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { UserProps } from "@/app/types/UserType";
import { useAuthStore } from "@/app/store";
interface BalanceGameCardProps {
  game: BalanceGameListProps;
  delay?: number;
  isDelete?: boolean;
  rank?: number;
}

export const BalanceGameCardSkeleton = () => {
  return (
    <div className="bg-zinc-800/50 rounded-2xl overflow-hidden border border-zinc-700">
      <div className="p-6 relative overflow-hidden">
        {/* 제목 스켈레톤 */}
        <div className="mb-3 flex items-center gap-2">
          <div className="h-6 w-20 bg-zinc-700/50 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent animate-sweep" />
          </div>
          <div className="h-6 w-48 bg-zinc-700/50 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent animate-sweep" />
          </div>
        </div>

        {/* 작성자 정보 스켈레톤 */}
        <div className="flex items-center justify-between text-sm mb-4">
          <div className="h-4 w-24 bg-zinc-700/50 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent animate-sweep" />
          </div>
          <div className="h-4 w-20 bg-zinc-700/50 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent animate-sweep" />
          </div>
        </div>

        {/* 통계 정보 스켈레톤 */}
        <div className="flex items-center gap-6 text-sm">
          <div className="h-4 w-20 bg-zinc-700/50 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent animate-sweep" />
          </div>
          <div className="h-4 w-16 bg-zinc-700/50 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent animate-sweep" />
          </div>
          <div className="h-4 w-16 bg-zinc-700/50 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent animate-sweep" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function BalanceGameCard({
  game,
  delay = 0,
  isDelete = false,
  rank,
}: BalanceGameCardProps) {
  const gameId = game.id;
  const { user, setUser } = useAuthStore((state) => state);
  const queryClient = useQueryClient();
  const { mutate: deleteGameHandler } = useMutation({
    mutationFn: (id: number) => deleteBalaceGameData(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERYKEYS.balanceGame.all(),
      });
      alert("게임이 삭제되었습니다.");
    },
    onError: (error: any) => {
      return alert(error);
    },
  });
  const handleDelete = () => {
    if (
      window.confirm("정말로 이 게임을 삭제하시겠습니까? 복구는 불가능합니다.")
    ) {
      deleteGameHandler(Number(gameId));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="relative"
    >
      {rank && rank <= 3 && (
        <div className="absolute -top-3 right-4 z-10">
          {rank === 1 && (
            <div className="flex items-center justify-center w-[80px] h-[32px] rounded-full bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-500 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-200 group">
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-yellow-200 animate-pulse"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 .587l3.668 7.431 8.332 1.21-6.001 5.85 1.416 8.265L12 18.925l-7.415 3.918 1.416-8.265-6.001-5.85 8.332-1.21z" />
                </svg>
                <span className="font-bold">BEST</span>
              </div>
            </div>
          )}
          {rank === 2 && (
            <div className="flex items-center justify-center w-[80px] h-[32px] rounded-full bg-gradient-to-r from-zinc-300 via-zinc-400 to-zinc-500 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-200">
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-zinc-200"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28z" />
                </svg>
                <span className="font-bold">TOP 2</span>
              </div>
            </div>
          )}
          {rank === 3 && (
            <div className="flex items-center justify-center w-[80px] h-[32px] rounded-full bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-200">
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-amber-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28z" />
                </svg>
                <span className="font-bold">TOP 3</span>
              </div>
            </div>
          )}
        </div>
      )}
      {(user?.role === "SUPER_ADMIN" || user?.nickname === game.username) &&
        isDelete && (
          <button
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            className="absolute top-2 right-2 p-2 text-zinc-400 hover:text-red-500 transition-colors z-10"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      <Link
        href={`/game/balanceGame/${game.id}`}
        className="group block bg-zinc-800/50 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-zinc-700/50 border border-zinc-700"
      >
        <div className="p-6">
          <h3 className="text-xl font-medium mb-3 text-white truncate">
            <span className="text-indigo-400 font-bold mr-2">
              [{game.questionsCount}개의 질문]
            </span>
            {game.title}
          </h3>

          <div className="flex items-center justify-between text-sm mb-4">
            <span className="font-medium text-zinc-300">{game.username}</span>
            <time className="text-zinc-400">
              {new Date(game.createdAt).toLocaleDateString()}
            </time>
          </div>

          <div className="flex items-center gap-6 text-sm text-zinc-400">
            {/* 참여자 수 */}
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span>{game.participantCount.toLocaleString()}명 참여</span>
            </div>

            {/* 댓글 수 */}
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>{game.commentsCount}</span>
            </div>

            {/* 질문 수 */}
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{game.questionsCount}개</span>
            </div>
          </div>
          {/* 
          <div className="mt-4 py-3 px-4 bg-zinc-900/50 rounded-lg">
            <div className="text-sm text-zinc-400">
              <span className="text-indigo-400 font-medium">예시 질문</span>
              <span className="mx-2">•</span>
              <span>당신의 선택은?</span>
            </div>
          </div> */}
        </div>
      </Link>
    </motion.div>
  );
}
