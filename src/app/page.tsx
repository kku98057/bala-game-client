"use client";
import Header from "./_components/Header";
import GameUseCaseSection from "./_components/mainpage/GameUseCaseSection";

import HeroSection from "./_components/mainpage/HeroSection";
export default function Home() {
  return (
    <>
      <Header />
      <main className="bg-gradient-to-b from-zinc-900 to-zinc-800 min-h-dvh ">
        <HeroSection />
        <GameUseCaseSection />
      </main>
    </>
  );
}
