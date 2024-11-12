import { ReactNode } from "react";
import Header from "../_components/Header";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="bg-gradient-to-b from-zinc-900 to-zinc-800 min-h-dvh">
        {children}
      </main>
    </>
  );
}
