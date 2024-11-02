import { ReactNode } from "react";
import { Metadata } from "next";
import Header from "../../_components/Header";
export const metadata: Metadata = {
  title: "밸런썸 (Balancesome) - 게임목록",
  description:
    "밸런썸 (Balancesome) 다양한 게임을 만들고 즐기고 공유하고 랭킹을 확인하세요!",
};

export default function GameLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="bg-gradient-to-b from-zinc-900 to-zinc-800 min-h-dvh">
        {children}
      </main>
    </>
  );
}
