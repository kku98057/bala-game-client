import { Metadata } from "next";
import defaultMetaDatas from "../_components/metadata/defaultMetaDatas";
import GameListSection from "./_components/GameListSection";
export const metadata: Metadata = defaultMetaDatas({ subTitle: "게임 리스트" });
export default function GameMainPage() {
  return <GameListSection limit={10} />;
}
