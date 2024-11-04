import { QUERYKEYS } from "@/queryKeys";

import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";
import BalaceGameSection from "./_components/BalaceGameSection";
import { getBalanceGameData } from "./_lib/getBalanceGameData";
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
  const gameData = await getBalanceGameData(NumberId);

  // 메타데이터 생성
  return generateGameMetadata({
    gameData,
    gameType: "BALANCE",
  });
}
export default async function page({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const queryClient = new QueryClient();

  try {
    const NumberId = Number((await params).gameId);

    const gameData = await getBalanceGameData(NumberId);

    if (!gameData) {
      notFound();
    }

    await queryClient.prefetchQuery({
      queryKey: QUERYKEYS.balanceGame.list(NumberId),
      queryFn: () => Promise.resolve(gameData),
    });

    const dehydrateState = dehydrate(queryClient);

    return (
      <HydrationBoundary state={dehydrateState}>
        <BalaceGameSection />
      </HydrationBoundary>
    );
  } catch (error) {
    notFound();
  }
}
