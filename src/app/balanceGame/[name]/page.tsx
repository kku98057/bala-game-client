import { QUERYKEYS } from "@/queryKeys";
import BalanceGameSection from "./_components/BalanceGameSection";
import { getBalanceGameData } from "./_lib/getBalanceGameData";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";
export default async function page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const queryClient = new QueryClient();

  try {
    const gameId = Number((await params).name);
    const gameData = await getBalanceGameData(gameId);

    // 데이터가 없는 경우 404
    if (!gameData) {
      notFound();
    }

    await queryClient.prefetchQuery({
      queryKey: QUERYKEYS.balanceGame.list(gameId),
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
