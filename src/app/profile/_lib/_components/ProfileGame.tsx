"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getUserGameData } from "../getUserGameData";
import Loading from "@/app/_components/Loading";
import { QUERYKEYS } from "@/queryKeys";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";

export default function ProfileGameList() {
  const [activeTab, setActiveTab] = useState<"BALANCE" | "TOURNAMENT">(
    "BALANCE"
  );
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: QUERYKEYS.profile.games({ gameType: activeTab }),
    queryFn: () => getUserGameData({ gameType: activeTab, limit: 5, page }),
  });

  if (isLoading) {
    return <Loading overlay />;
  }

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 bg-zinc-800/30 rounded-lg">
      <p className="text-zinc-400 text-center mb-4">
        {activeTab === "BALANCE"
          ? "아직 만든 밸런스 게임이 없어요"
          : "아직 만든 이상형 월드컵이 없어요"}
      </p>
      <Link
        href={`/game/${
          activeTab === "BALANCE" ? "balanceGame" : "tournamentGame"
        }/create`}
        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
      >
        <FiPlus className="w-5 h-5" />
        <span>
          {activeTab === "BALANCE"
            ? "밸런스 게임 만들기"
            : "이상형 월드컵 만들기"}
        </span>
      </Link>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => {
            setActiveTab("BALANCE");
            setPage(1);
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${
              activeTab === "BALANCE"
                ? "bg-indigo-500 text-white"
                : "bg-zinc-800 text-zinc-400"
            }`}
        >
          밸런스 게임
        </button>
        <button
          onClick={() => {
            setActiveTab("TOURNAMENT");
            setPage(1);
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${
              activeTab === "TOURNAMENT"
                ? "bg-indigo-500 text-white"
                : "bg-zinc-800 text-zinc-400"
            }`}
        >
          이상형월드컵
        </button>
      </div>

      {data?.games.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="space-y-2">
            {data?.games.map((game: any) => (
              <Link
                key={game.id}
                href={`/game/${
                  activeTab === "BALANCE" ? "balanceGame" : "tournamentGame"
                }/${game.id}`}
                className="block bg-zinc-800/30 p-4 rounded-lg hover:bg-zinc-800/50 transition-all"
              >
                <h3 className="font-medium text-white">{game.title}</h3>
                <div className="mt-2 flex gap-4 text-sm text-zinc-400">
                  <p>댓글 {game._count.comments}</p>
                  <p>
                    {activeTab === "BALANCE"
                      ? `질문 ${game._count.questions}개`
                      : `항목 ${game._count.items}개`}
                  </p>
                  <p>{new Date(game.createdAt).toLocaleDateString()}</p>
                </div>
              </Link>
            ))}
          </div>

          {data?.pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: data.pagination.totalPages }).map(
                (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-8 h-8 rounded-full ${
                      page === i + 1
                        ? "bg-indigo-500 text-white"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {i + 1}
                  </button>
                )
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
