import { motion } from "framer-motion";
import Container from "../Container";
import { dehydrate, Hydrate, QueryClient } from "@tanstack/react-query";
import { QUERYKEYS } from "@/queryKeys";
import BalanceGameList from "./_components/MainBalanceGameList";
import getBalanceGameListData from "@/app/game/balanceGame/_lib/getBalanceGameListData";

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
      <BalanceGameList />
    </Hydrate>
  );
}
