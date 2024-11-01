"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { QUERYKEYS } from "@/queryKeys";
import Image from "next/image";
import { getBalaceGameStatisticsData } from "./_lib/getBalaceGameStatisticsData";
import { GameStatistics } from "@/app/types/gameType";
import Section from "@/app/_components/Section";
import { useEffect, useState } from "react";
import { FaCrown } from "react-icons/fa"; // 왕관 아이콘
import CustomLink from "@/app/_components/buttons/CustomLink";
import TitleText from "@/app/_components/TitleText";
import Comments from "@/app/_components/comment/Comment";

export default function StatisticsPage() {
  const { gameId } = useParams();

  const { data: statistics, isLoading } = useQuery<GameStatistics>({
    queryKey: QUERYKEYS.balanceGame.statistics(Number(gameId)),
    queryFn: () => getBalaceGameStatisticsData(Number(gameId)),
  });
  const [showProgress, setShowProgress] = useState(false);

  // 컴포넌트가 마운트된 후 애니메이션 시작
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowProgress(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  if (isLoading) {
    return <div>로딩 중...</div>;
  }
  // 순위별 왕관 색상
  const crownColors = {
    0: "text-yellow-400", // 금관
    1: "text-gray-300", // 은관
    2: "text-amber-600", // 동관
  };

  return (
    <>
      <Section>
        <div className="w-full flex items-center justify-between mb-8">
          <TitleText>게임 통계</TitleText>
          <div className="flex items-center justify-center gap-4">
            <CustomLink
              icon="arrow"
              href={`/balanceGame/${gameId}`}
              iconPosition="right"
            >
              다시하기
            </CustomLink>
            <CustomLink icon="arrow" href="/balanceGame" iconPosition="right">
              게임목록
            </CustomLink>
          </div>
        </div>

        <div className="bg-zinc-800 rounded-lg p-6">
          <div className="text-lg text-white mb-4">
            총 참여자 수:{" "}
            <span className="font-bold">
              {statistics?.totalCount.toLocaleString()}명
            </span>
          </div>

          <div className="space-y-6">
            {statistics?.items.map((item, index) => (
              <div key={item.id} className="bg-zinc-700 rounded-lg p-4">
                <div className="flex items-center gap-4 mb-3">
                  {/* 순위 왕관 (1-3위만 표시) */}
                  {index < 3 && (
                    <div
                      className={`text-2xl ${
                        crownColors[index as keyof typeof crownColors]
                      }`}
                    >
                      <FaCrown />
                    </div>
                  )}

                  <div className="relative w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">
                      {item.name}
                    </h3>
                    <p className="text-zinc-400">
                      {item.count.toLocaleString()}명 선택
                    </p>
                  </div>

                  <div className="text-2xl font-bold text-indigo-400">
                    {item.percentage}%
                  </div>
                </div>

                {/* 프로그레스 바 */}
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
      </Section>
      <Section>
        <Comments gameId={Number(gameId)} />
      </Section>
    </>
  );
}
