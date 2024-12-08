"use client";

import { useQuery } from "@tanstack/react-query";
import Section from "../Section";
import { useState } from "react";
import Image from "next/image";
import { FiAward, FiUser } from "react-icons/fi";
import { QUERYKEYS } from "@/queryKeys";
import { getBalanceGameRankingData } from "./_lib/getBalanceGameRankingData";
import { getWorldcupGameRankingData } from "./_lib/getWorldcupGameRankingData";

const RankBadge = ({ rank }: { rank: number }) => {
  // SVG 크라운 아이콘들
  const crowns = {
    1: (
      <svg
        className="w-6 h-6 text-yellow-400"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M2.5 7.5L5 16.5H19L21.5 7.5L16.5 10.5L12 4.5L7.5 10.5L2.5 7.5Z" />
        <path d="M5 16.5V18.5H19V16.5H5Z" />
      </svg>
    ),
    2: (
      <svg
        className="w-6 h-6 text-zinc-400"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M3 7.5L5.5 16.5H18.5L21 7.5L16.5 10.5L12 4.5L7.5 10.5L3 7.5Z" />
        <path d="M5.5 16.5V18.5H18.5V16.5H5.5Z" />
      </svg>
    ),
    3: (
      <svg
        className="w-6 h-6 text-amber-600"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M3.5 7.5L6 16.5H18L20.5 7.5L16.5 10.5L12 4.5L7.5 10.5L3.5 7.5Z" />
        <path d="M6 16.5V18.5H18V16.5H6Z" />
      </svg>
    ),
  };

  return (
    <div className="relative flex items-center justify-center w-8">
      {rank <= 3 ? (
        crowns[rank as keyof typeof crowns]
      ) : (
        <span className="font-bold text-zinc-500">{rank}</span>
      )}
    </div>
  );
};

export default function MainRanking() {
  const [activeTab, setActiveTab] = useState<"BALANCE" | "TOURNAMENT">(
    "BALANCE"
  );

  const { data: balanceRanking } = useQuery({
    queryKey: QUERYKEYS.rankings.balance(),
    queryFn: getBalanceGameRankingData,
  });

  const { data: tournamentRanking } = useQuery({
    queryKey: QUERYKEYS.rankings.tournament(),
    queryFn: getWorldcupGameRankingData,
  });

  const currentRanking =
    activeTab === "BALANCE" ? balanceRanking : tournamentRanking;

  return (
    <Section variant="secondary" className="pb-20">
      <div className="flex items-center justify-between mb-12 ">
        <h2 className="text-3xl font-bold text-white text-left ">
          실시간 랭킹
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("BALANCE")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${
                activeTab === "BALANCE"
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700/80"
              }`}
          >
            밸런스 게임
          </button>
          <button
            onClick={() => setActiveTab("TOURNAMENT")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${
                activeTab === "TOURNAMENT"
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700/80"
              }`}
          >
            이상형월드컵
          </button>
        </div>
      </div>

      <div className="bg-zinc-800/30 rounded-lg divide-y divide-zinc-700/50">
        {currentRanking?.ranking.map((user: any) => (
          <div
            key={user.userId}
            className={`flex items-center gap-4 p-4 transition-colors
              ${
                user.rank <= 3
                  ? "bg-zinc-800/50 hover:bg-zinc-700/50"
                  : "hover:bg-zinc-800/50"
              }`}
          >
            <RankBadge rank={user.rank} />
            <div className="relative w-10 h-10 flex-shrink-0">
              {user.profileImageUrl ? (
                <Image
                  src={user.profileImageUrl}
                  alt={user.nickname}
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-zinc-700 flex items-center justify-center">
                  <span className="text-lg font-bold text-zinc-400">
                    {user.nickname.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-white flex items-center gap-2">
                {user.nickname}
                {user.rank <= 3 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full 
                      ${
                        user.rank === 1
                          ? "bg-yellow-400/20 text-yellow-400"
                          : user.rank === 2
                          ? "bg-zinc-400/20 text-zinc-400"
                          : "bg-amber-600/20 text-amber-600"
                      }`}
                  >
                    {user.rank === 1 ? "1st" : user.rank === 2 ? "2nd" : "3rd"}
                  </span>
                )}
              </p>
              <p className="text-sm text-zinc-400">
                총 {user.totalParticipants.toLocaleString()}명 참여
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
