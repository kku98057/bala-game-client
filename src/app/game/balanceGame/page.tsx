import { Metadata } from "next";
import BalanceGameListSection from "./_components/BalanceGameListSection";
import defaultMetaDatas from "@/app/_components/metadata/defaultMetaDatas";
export const metadata: Metadata = defaultMetaDatas({
  subTitle: "밸런스 게임 리스트",
});
export default function page() {
  return <BalanceGameListSection limit={10} />;
}
