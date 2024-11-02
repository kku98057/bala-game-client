import { QUERYKEYS } from "@/queryKeys";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import getTournamenGameListData from "./_lib/getTournamenGameListData";
import TournamentGameListSection from "./_components/TournamentGameListSection";
import { TournamentListResponse } from "../../types/gameType";

export default async function GamePage() {
  const limit = 10;
  // const queryClient = new QueryClient();
  // await queryClient.prefetchInfiniteQuery<TournamentListResponse>({
  //   queryKey: QUERYKEYS.tournamentGame.lists({ limit }),
  //   queryFn: ({ pageParam = 1 }) =>
  //     getTournamenGameListData({ page: pageParam, limit }),
  //   initialPageParam: 1,
  // });
  // const dehydrateState = dehydrate(queryClient);
  return (
    // <HydrationBoundary state={dehydrateState}>
    // </HydrationBoundary>
    <TournamentGameListSection limit={limit} />
  );
}
