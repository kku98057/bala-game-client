import { ReactNode } from "react";
import Header from "../_components/Header";

export default function GameLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
