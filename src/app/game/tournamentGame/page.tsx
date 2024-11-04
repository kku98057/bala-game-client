import TournamentGameListSection from "./_components/TournamentGameListSection";
import { Metadata } from "next";
import defaultMetaDatas from "@/app/_components/metadata/defaultMetaDatas";
export const metadata: Metadata = defaultMetaDatas({
  subTitle: "토너먼트 게임 리스트",
});
export default async function GamePage() {
  const limit = 10;

  return <TournamentGameListSection limit={limit} />;
}
