import { dehydrate, Hydrate, QueryClient } from "@tanstack/react-query";
import { QUERYKEYS } from "@/queryKeys";
import getBalanceGameListData from "@/app/game/balanceGame/_lib/getBalanceGameListData";
import MainBalanceGameList from "./_components/MainBalanceGameList";

export default async function MainBalanceGameSection() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: QUERYKEYS.balanceGame.lists({
      limit: 4,
      sort: "popular",
      period: "all",
    }),
    queryFn: () =>
      getBalanceGameListData({
        limit: 4,
        sort: "popular",
        period: "all",
        page: 1,
      }),
  });
  const dehydratedState = dehydrate(queryClient);
  return (
    <Hydrate state={dehydratedState}>
      <MainBalanceGameList />
    </Hydrate>
  );
}
