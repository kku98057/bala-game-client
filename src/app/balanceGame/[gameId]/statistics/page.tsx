"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { QUERYKEYS } from "@/queryKeys";
import Image from "next/image";
import { getBalaceGameStatisticsData } from "./_lib/getBalaceGameStatisticsData";
import { GameStatistics } from "@/app/types/gameType";
import Section from "@/app/_components/Section";

export default function StatisticsPage() {
  const { gameId } = useParams();

  const { data: statistics, isLoading } = useQuery<GameStatistics>({
    queryKey: QUERYKEYS.balanceGame.statistics(Number(gameId)),
    queryFn: () => getBalaceGameStatisticsData(Number(gameId)),
  });

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <Section>
      <h1 className="text-3xl font-bold text-white mb-8">게임 통계</h1>

      <div className="bg-zinc-800 rounded-lg p-6">
        <div className="text-lg text-white mb-4">
          총 참여자 수:{" "}
          <span className="font-bold">
            {statistics?.totalCount.toLocaleString()}명
          </span>
        </div>

        <div className="space-y-6">
          {statistics?.items.map((item) => (
            <div key={item.id} className="bg-zinc-700 rounded-lg p-4">
              <div className="flex items-center gap-4 mb-3">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{item.name}</h3>
                  <p className="text-zinc-400">
                    {item.count.toLocaleString()}명 선택
                  </p>
                </div>
                <div className="ml-auto">
                  <span className="text-2xl font-bold text-indigo-400">
                    {item.percentage}%
                  </span>
                </div>
              </div>

              <div className="w-full h-2 bg-zinc-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-1000"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
