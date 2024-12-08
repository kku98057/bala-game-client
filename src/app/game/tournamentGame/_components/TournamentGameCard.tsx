import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { TournamentList } from "@/app/types/gameType";
import Cookies from "js-cookie";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERYKEYS } from "@/queryKeys";
import deleteTournamentGameData from "../_lib/deleteTournamentGameData";
import { useEffect, useState } from "react";
import { UserProps } from "@/app/types/UserType";
import { useAuthStore } from "@/app/store";
interface TournamentGameCardProps {
  game: TournamentList;
  delay?: number;
  isDelete?: boolean;
}

export default function TournamentGameCard({
  game,
  delay = 0,
  isDelete = false,
}: TournamentGameCardProps) {
  const gameId = game.id;
  const { user, setUser } = useAuthStore((state) => state);

  const queryClient = useQueryClient();
  const { mutate: deleteGameHandler } = useMutation({
    mutationFn: (id: number) => deleteTournamentGameData(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERYKEYS.tournamentGame.all(),
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
      {(user?.role === "SUPER_ADMIN" || user?.nickname === game.username) &&
        isDelete && (
          <button
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            className="absolute -top-4 -right-4 p-2 bg-indigo-800 rounded-full text-zinc-400 hover:text-red-500 transition-colors z-30"
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
        href={`/game/tournamentGame/${game.id}`}
        className="group block relative overflow-hidden rounded-2xl transition-all duration-300"
      >
        {/* 배경 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 z-0" />

        {/* 호버 효과용 그라데이션 오버레이 */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-indigo-600/20 via-transparent to-transparent transition-all duration-300 z-10" />

        {/* 장식용 패턴 */}
        <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:24px_24px] z-20" />

        {/* VS 섹션 */}
        <div className="flex relative items-center justify-center  p-4 bg-zinc-800/50 rounded-xl group-hover:bg-zinc-700/50 transition-colors duration-300">
          <div className="relative flex-1 aspect-[1/1] rounded-lg rounded-tr-none rounded-br-none overflow-hidden">
            <Image
              src={game.items[0].imageUrl}
              alt={game.items[0].name}
              fill
              className="object-cover object-left-top"
              sizes="100%"
            />
          </div>
          <span className="absolute text-[24px] p-2 block rounded-full bg-indigo-800/80 z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-indigo-400  group-hover:text-indigo-300 transition-colors duration-300">
            VS
          </span>
          <div className="relative flex-1 aspect-[1/1] rounded-lg rounded-tl-none rounded-bl-none overflow-hidden">
            <Image
              src={game.items[1].imageUrl}
              alt={game.items[1].name}
              fill
              className="object-cover "
              sizes="100%"
            />
          </div>
        </div>

        {/* 컨텐츠 */}
        <div className="relative p-6  text-white z-30">
          {/* 타이틀 섹션 */}
          <div className="mb-2 flex items-center gap-2 ">
            <span className="inline-block px-3 py-1 bg-indigo-600/20 text-indigo-400 text-sm font-medium rounded-full">
              {game.itemsCount}강전
            </span>
            <h3 className="text-xl font-bold truncate group-hover:text-indigo-300 transition-colors duration-300">
              {game.title}
            </h3>
          </div>

          {/* 메타 정보 */}
          <div className="flex items-center justify-between text-sm text-zinc-400 mb-2">
            <span className="font-medium">{game.username}</span>
            <time className="text-zinc-500">
              {new Date(game.createdAt).toLocaleDateString()}
            </time>
          </div>

          {/* 참여자 수 */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
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
            <div className="flex items-center gap-1 text-sm text-zinc-400">
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
          </div>
          {/* 시작하기 버튼 */}
          {/* <div className="mt-6 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <span className="inline-flex items-center justify-center w-full gap-2 text-sm text-indigo-400 group-hover:text-indigo-300 font-medium">
              게임 시작하기
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
          </div> */}
        </div>

        {/* 테두리 효과 */}
        <div className="absolute inset-0 rounded-2xl border border-zinc-700/50 group-hover:border-indigo-500/30 transition-colors duration-300" />
      </Link>
    </motion.div>
  );
}

export const TournamentGameCardSkeleton = () => {
  return (
    <div className="bg-zinc-800/50 rounded-2xl overflow-hidden border border-zinc-700">
      {/* VS 섹션 스켈레톤 */}
      <div className="flex relative items-center justify-center p-4 bg-zinc-800/50 rounded-xl">
        <div className="relative flex-1 aspect-[1/1] rounded-lg rounded-tr-none rounded-br-none overflow-hidden bg-zinc-700/50">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent animate-sweep" />
        </div>
        <span className="absolute text-[24px] p-2 block rounded-full bg-indigo-800/80 z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-indigo-400">
          VS
        </span>
        <div className="relative flex-1 aspect-[1/1] rounded-lg rounded-tl-none rounded-bl-none overflow-hidden bg-zinc-700/50">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent animate-sweep" />
        </div>
      </div>

      {/* 컨텐츠 스켈레톤 */}
      <div className="relative p-6 text-white">
        {/* 타이틀 섹션 스켈레톤 */}
        <div className="mb-2 flex items-center gap-2">
          <div className="h-6 w-16 bg-zinc-700/50 rounded-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent animate-sweep" />
          </div>
          <div className="h-6 w-48 bg-zinc-700/50 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent animate-sweep" />
          </div>
        </div>

        {/* 메타 정보 스켈레톤 */}
        <div className="flex items-center justify-between text-sm mb-2">
          <div className="h-4 w-24 bg-zinc-700/50 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent animate-sweep" />
          </div>
          <div className="h-4 w-20 bg-zinc-700/50 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent animate-sweep" />
          </div>
        </div>

        {/* 참여자 수 & 댓글 수 스켈레톤 */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-24 bg-zinc-700/50 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent animate-sweep" />
          </div>
          <div className="h-4 w-16 bg-zinc-700/50 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent animate-sweep" />
          </div>
        </div>
      </div>

      {/* 테두리 효과 */}
    </div>
  );
};
