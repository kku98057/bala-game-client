import { motion } from "framer-motion";
import Container from "../Container";
import { dehydrate, Hydrate, QueryClient } from "@tanstack/react-query";
import { QUERYKEYS } from "@/queryKeys";
import BalanceGameList from "./_components/MainBalanceGameList";

export default async function MainBalanceGameSection() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: QUERYKEYS.balanceGame.lists({ limit: 4, sort: "popular" }),
  });
  const dehydratedState = dehydrate(queryClient);
  return (
    <Hydrate state={dehydratedState}>
      <BalanceGameList />
    </Hydrate>
  );
}
