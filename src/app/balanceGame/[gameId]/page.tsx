import { QUERYKEYS } from "@/queryKeys";
import BalanceGameSection from "./_components/BalanceGameSection";
import { getBalanceGameData } from "./_lib/getBalanceGameData";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
// 동적 메타데이터 생성

export default async function page({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const queryClient = new QueryClient();

  try {
    const NumberId = Number((await params).gameId);
    const gameData = await getBalanceGameData(NumberId);

    // 데이터가 없는 경우 404
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
        <BalanceGameSection />
      </HydrationBoundary>
    );
  } catch (error) {
    // 에러 발생시 404
    notFound();
  }
}
