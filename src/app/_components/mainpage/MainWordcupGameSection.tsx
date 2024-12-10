import { dehydrate, Hydrate, QueryClient } from "@tanstack/react-query";
import { QUERYKEYS } from "@/queryKeys";
import MainWorldcupGameList from "./_components/MainWorldcupGameList";
import getTournamenGameListData from "@/app/game/tournamentGame/_lib/getTournamenGameListData";

export default async function MainWordcupGameSection() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: QUERYKEYS.tournamentGame.lists({
      limit: 4,
      sort: "popular",
      period: "all",
    }),
    queryFn: () =>
      getTournamenGameListData({
        limit: 4,
        sort: "popular",
        period: "all",
        page: 1,
      }),
  });
  const dehydratedState = dehydrate(queryClient);
  return (
    <Hydrate state={dehydratedState}>
      <MainWorldcupGameList />
    </Hydrate>
  );
}
