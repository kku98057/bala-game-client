import { QUERYKEYS } from "@/queryKeys";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import balanceGameListData from "./_lib/balanceGameListData";
import BalaceGameListSection from "./_components/BalaceGameListSection";

export default async function GamePage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: QUERYKEYS.balanceGame.lists({ limit: 10 }),
    queryFn: ({ pageParam }) =>
      balanceGameListData({ page: pageParam, limit: 10 }),
    initialPageParam: 1,
  });
  const dehydrateState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydrateState}>
      <BalaceGameListSection />
    </HydrationBoundary>
  );
}
