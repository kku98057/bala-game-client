import { QUERYKEYS } from "@/queryKeys";
import BalanceGameSection from "./_components/BalanceGameSection";
import { getBalanceGameData } from "./_lib/getBalanceGameData";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
export default async function page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: QUERYKEYS.balanceGame.list(Number((await params).name)),
    queryFn: async () => getBalanceGameData(Number((await params).name)),
  });
  const dehydrateState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydrateState}>
      <BalanceGameSection />
    </HydrationBoundary>
  );
}
