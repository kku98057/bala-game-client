import { QUERYKEYS } from "@/queryKeys";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import balanceGameListData from "./_lib/balanceGameListData";
import BalaceGameListSection from "./_components/BalaceGameListSection";
import { BalanceGameListResponse } from "../types/gameType";

export default async function GamePage() {
  const limit = 10;
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery<BalanceGameListResponse>({
    queryKey: QUERYKEYS.balanceGame.lists({ limit }),
    queryFn: ({ pageParam = 1 }) =>
      balanceGameListData({ page: pageParam, limit }),
    initialPageParam: 1,
  });
  const dehydrateState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydrateState}>
      <BalaceGameListSection limit={limit} />
    </HydrationBoundary>
  );
}
