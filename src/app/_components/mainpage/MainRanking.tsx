"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Section from "../Section";
import Image from "next/image";
import { QUERYKEYS } from "@/queryKeys";
import { getBalanceGameRankingData } from "./_lib/getBalanceGameRankingData";
import { getWorldcupGameRankingData } from "./_lib/getWorldcupGameRankingData";

const RankBadge = ({ rank }: { rank: number }) => {
  const crowns = {
    1: <span className="text-yellow-400">🥇</span>,
    2: <span className="text-zinc-400">🥈</span>,
    3: <span className="text-amber-600">🥉</span>,
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

const RankingSkeleton = () => {
  return (
    <div className="bg-zinc-800/30 rounded-lg divide-y divide-zinc-700/50 flex flex-col gap-[20px]">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 p-4 relative overflow-hidden"
        >
          {/* 순위 스켈레톤 */}
          <div className="w-8 h-8 bg-zinc-700/50 rounded-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent animate-sweep" />
          </div>

          {/* 프로필 이미지 스켈레톤 */}
          <div className="relative w-10 h-10 flex-shrink-0">
            <div className="w-full h-full rounded-full bg-zinc-700/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent animate-sweep" />
            </div>
          </div>

          {/* 텍스트 정보 스켈레톤 */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-4 w-24 bg-zinc-700/50 rounded relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent animate-sweep" />
              </div>
              {index < 3 && (
                <div className="h-4 w-12 bg-zinc-700/50 rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent animate-sweep" />
                </div>
              )}
            </div>
            <div className="h-3 w-32 bg-zinc-700/50 rounded relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent animate-sweep" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// 애니메이션을 위한 CSS 추가
const slideAnimation = {
  enter: "transition-all duration-500 transform translate-y-0 opacity-100",
  exit: "transition-all duration-500 transform -translate-y-full opacity-0",
};

export default function MainRanking() {
  const [activeTab, setActiveTab] = useState<"BALANCE" | "TOURNAMENT">(
    "BALANCE"
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentRollingIndex, setCurrentRollingIndex] = useState(0);

  const { data: balanceRanking, isLoading: isBalanceLoading } = useQuery({
    queryKey: QUERYKEYS.rankings.balance(),
    queryFn: getBalanceGameRankingData,
  });

  const { data: tournamentRanking, isLoading: isTournamentLoading } = useQuery({
    queryKey: QUERYKEYS.rankings.tournament(),
    queryFn: getWorldcupGameRankingData,
  });

  const isLoading = isBalanceLoading || isTournamentLoading;
  const currentRanking =
    activeTab === "BALANCE" ? balanceRanking : tournamentRanking;

  useEffect(() => {
    if (!isExpanded && currentRanking?.ranking.length) {
      const interval = setInterval(() => {
        setCurrentRollingIndex((prev) =>
          prev === currentRanking.ranking.length - 1 ? 0 : prev + 1
        );
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isExpanded, currentRanking]);

  return (
    <Section className="pb-10 sm:pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4 sm:gap-0">
        <div className="flex items-center gap-4">
          <h2 className="text-xl sm:text-3xl font-bold text-white">
            실시간 랭킹
          </h2>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("BALANCE")}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "BALANCE"
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700/80"
            }`}
          >
            밸런스 게임
          </button>
          <button
            onClick={() => setActiveTab("TOURNAMENT")}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "TOURNAMENT"
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700/80"
            }`}
          >
            이상형월드컵
          </button>
        </div>
      </div>

      {isLoading ? (
        <RankingSkeleton />
      ) : (
        <div
          className="bg-zinc-800/30 rounded-lg divide-y divide-zinc-700/50 relative overflow-hidden cursor-pointer group"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            // 펼쳐진 상태의 리스트
            <>
              {currentRanking?.ranking.slice(0, 10).map((user: any) => (
                <div
                  key={user.userId}
                  className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 transition-colors hover:bg-zinc-800/50"
                >
                  <RankBadge rank={user.rank} />
                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                    {user.profileImageUrl ? (
                      <Image
                        src={user.profileImageUrl}
                        alt={user.nickname}
                        fill
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-zinc-700 flex items-center justify-center">
                        <span className="text-base sm:text-lg font-bold text-zinc-400">
                          {user.nickname.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white flex items-center gap-2 text-sm sm:text-base">
                      <span className="truncate">{user.nickname}</span>
                    </p>
                    <p className="text-xs sm:text-sm text-zinc-400 truncate">
                      총 {user.totalParticipants.toLocaleString()}명 참여
                    </p>
                  </div>
                </div>
              ))}
              <div className="flex justify-center p-2">
                <div className="text-zinc-400 hover:text-white transition-colors">
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
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* 롤링되는 단일 아이템 */}
              <div className="relative h-[72px] sm:h-[80px]">
                <div
                  key={currentRanking?.ranking[currentRollingIndex]?.userId}
                  className={`absolute w-full ${slideAnimation.enter}`}
                >
                  <div className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 transition-colors hover:bg-zinc-800/50">
                    <RankBadge
                      rank={currentRanking?.ranking[currentRollingIndex]?.rank}
                    />
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                      {currentRanking?.ranking[currentRollingIndex]
                        ?.profileImageUrl ? (
                        <Image
                          src={
                            currentRanking.ranking[currentRollingIndex]
                              .profileImageUrl
                          }
                          alt={
                            currentRanking.ranking[currentRollingIndex].nickname
                          }
                          fill
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-zinc-700 flex items-center justify-center">
                          <span className="text-base sm:text-lg font-bold text-zinc-400">
                            {currentRanking?.ranking[
                              currentRollingIndex
                            ]?.nickname.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white flex items-center gap-2 text-sm sm:text-base">
                        <span className="truncate">
                          {
                            currentRanking?.ranking[currentRollingIndex]
                              ?.nickname
                          }
                        </span>
                      </p>
                      <p className="text-xs sm:text-sm text-zinc-400 truncate">
                        총{" "}
                        {currentRanking?.ranking[
                          currentRollingIndex
                        ]?.totalParticipants.toLocaleString()}
                        명 참여
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center p-2">
                <div className="text-zinc-400 group-hover:text-white transition-colors">
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
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </Section>
  );
}
