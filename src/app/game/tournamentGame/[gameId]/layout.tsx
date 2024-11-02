import { Metadata } from "next";
import { ReactNode } from "react";
export const metadata: Metadata = {
  title: "밸런썸 (Balancesome) ",
  description:
    "밸런썸 (Balancesome) 다양한 게임을 만들고 즐기고 공유하고 랭킹을 확인하세요!",
};
export default function layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
