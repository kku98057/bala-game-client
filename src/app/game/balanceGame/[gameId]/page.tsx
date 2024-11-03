import { QUERYKEYS } from "@/queryKeys";

import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";
import BalaceGameSection from "./_components/BalaceGameSection";
import { getBalanceGameData } from "./_lib/getBalanceGameData";

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
