"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getTournamentGameStatisticsData } from "../_lib/getTournamentGameStatisticsData";
import { QUERYKEYS } from "@/queryKeys";
import StatisticsSection from "@/app/_components/game/StatisticsSection";
import Loading from "@/app/_components/Loading";
import { FaCrown } from "react-icons/fa";
import Image from "next/image";
import { TournamentGameStatisticsProps } from "@/app/types/TournamentGameType";

export default function TournamentStatisticSection() {
  const { gameId } = useParams();

  const { data: statistics, isLoading } =
    useQuery<TournamentGameStatisticsProps>({
      queryKey: QUERYKEYS.tournamentGame.statistics(Number(gameId)),
      queryFn: () => getTournamentGameStatisticsData(Number(gameId)),
    });
  const [showProgress, setShowProgress] = useState(false);

  // 컴포넌트가 마운트된 후 애니메이션 시작
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowProgress(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // 순위별 왕관 색상
  const crownColors = {
    0: "text-yellow-400", // 금관
    1: "text-gray-300", // 은관
    2: "text-amber-600", // 동관
  };

  return (
    <StatisticsSection
      title="월드컵 게임 통계"
      gameType="TOURNAMENT"
      username={statistics?.username as string}
      createdAt={statistics?.createdAt as string}
      count={statistics?.items.length as number}
    >
      <div className="w-full">
        <div className="bg-zinc-800 rounded-lg p-4 sm:p-6">
          <div className="mb-4">
            {statistics && (
              <div className="text-base sm:text-lg text-white">
                작성자: <span className="font-bold">{statistics.username}</span>
              </div>
            )}
          </div>
          {isLoading && <Loading />}
          <div className="space-y-4 sm:space-y-6">
            {statistics?.items.map((item, index) => (
              <div key={item.id} className="bg-zinc-700 rounded-lg p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-3">
                  {index < 3 && (
                    <div
                      className={`text-xl sm:text-2xl ${
                        crownColors[index as keyof typeof crownColors]
                      }`}
                    >
                      <FaCrown />
                    </div>
                  )}

                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      {item.name}
                    </h3>
                    <p className="text-sm sm:text-base text-zinc-400">
                      {item.count.toLocaleString()}명 선택
                    </p>
                  </div>

                  <div className="text-xl sm:text-2xl font-bold text-indigo-400">
                    {item.percentage}%
                  </div>
                </div>

                <div className="w-full h-2 bg-zinc-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-1000 ease-out"
                    style={{
                      width: showProgress ? `${item.percentage}%` : "0%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StatisticsSection>
  );
}
