import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import BalaceStatisticSection from "./_components/BalaceStatisticSection";
import { QUERYKEYS } from "@/queryKeys";
import { getBalaceGameStatisticsData } from "./_lib/getBalaceGameStatisticsData";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { generateGameMetadata } from "@/app/_components/metadata/GameMetadatas";
interface Props {
  params: {
    gameId: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // API나 데이터베이스에서 게임 데이터를 가져옵니다
  const NumberId = Number((await params).gameId);
  const gameData = await getBalaceGameStatisticsData(NumberId);

  // 메타데이터 생성
  return generateGameMetadata({
    gameData,
    gameType: "BALANCE",
    isStatistics: true,
  });
}
export default async function BalanceGameStatisticsPage({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const queryClient = new QueryClient();

  try {
    const NumberId = Number((await params).gameId);

    const gameData = await getBalaceGameStatisticsData(NumberId);

    if (!gameData) {
      notFound();
    }

    await queryClient.prefetchQuery({
      queryKey: QUERYKEYS.balanceGame.statistics(NumberId),
      queryFn: () => Promise.resolve(gameData),
    });

    const dehydrateState = dehydrate(queryClient);

    return (
      <HydrationBoundary state={dehydrateState}>
        <BalaceStatisticSection />
      </HydrationBoundary>
    );
  } catch (error) {
    notFound();
  }
}
