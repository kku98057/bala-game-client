import { ReactNode } from "react";
import Header from "../_components/Header";

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
