import { Metadata } from "next";
import { getBalanceGameData } from "./[gameId]/_lib/getBalanceGameData";
import BalanceGameListSection from "./_components/BalanceGameListSection";
import { generateGameMetadata } from "@/app/_components/metadata/GameMetadatas";

export default function page() {
  return <BalanceGameListSection limit={10} />;
}
