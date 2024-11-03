"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { QUERYKEYS } from "@/queryKeys";
import { motion } from "framer-motion";
import { getBalaceGameStatisticsData } from "./_lib/getBalaceGameStatisticsData";
import Loading from "@/app/_components/Loading";
import StatisticsSection from "@/app/_components/game/StatisticsSection";

interface BalanceGameStats {
  id: number;
  title: string;
  username: string;
  createdAt: string;
  commentsCount: number;
  questions: {
    id: number;
    title: string;
    participantCount: number;
    totalSelections: number;
    items: {
      id: number;
      name: string;
      selectCount: number;
      percentage: number;
    }[];
  }[];
}

export default function BalanceGameStatisticsPage() {
  const { gameId } = useParams();

  const { data, isLoading } = useQuery<BalanceGameStats>({
    queryKey: QUERYKEYS.balanceGame.statistics(Number(gameId)),
    queryFn: () => getBalaceGameStatisticsData(Number(gameId)),
  });

  if (!data && !isLoading) return null;

  return (
    <StatisticsSection
      title="밸런스게임 통계"
      gameType="BALANCE"
      username={data?.username as string}
      createdAt={data?.createdAt as string}
      count={data?.questions.length as number}
    >
      <div className="w-full">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="space-y-8">
            {data?.questions.map((question, qIndex) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: qIndex * 0.1 }}
                className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-shrink-0 w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-xl font-bold text-white">
                    {qIndex + 1}
                  </div>
                  <h2 className="text-xl font-bold text-white flex-1">
                    {question.title}
                  </h2>
                  <div className="text-sm text-zinc-400 bg-zinc-700/50 px-3 py-1 rounded-full">
                    참여자 {question.participantCount.toLocaleString()}명
                  </div>
                </div>

                <div className="grid gap-4">
                  {question.items.map((item, iIndex) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: qIndex * 0.1 + iIndex * 0.05 }}
                      className="bg-zinc-700/50 rounded-xl p-5 hover:bg-zinc-700 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-1">
                            {item.name}
                          </h3>
                          <p className="text-zinc-400 text-sm">
                            {item.selectCount.toLocaleString()}명이 선택
                          </p>
                        </div>
                        <div className="text-3xl font-bold text-indigo-400">
                          {item.percentage}%
                        </div>
                      </div>

                      <div className="relative w-full h-3 bg-zinc-600/50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: `${item.percentage}%` }}
                          transition={{
                            duration: 1,
                            ease: "easeOut",
                            delay: qIndex * 0.1 + iIndex * 0.05,
                          }}
                          className="absolute h-full bg-gradient-to-r from-indigo-500 to-indigo-400"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </StatisticsSection>
  );
}
