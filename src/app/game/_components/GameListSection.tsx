"use client";

import Section from "@/app/_components/Section";
import { FaBalanceScale, FaTrophy } from "react-icons/fa";
import GameCard from "./GameCard";
import { IconType } from "react-icons";
import TitleSection from "@/app/_components/TitleSection";
import { ReactNode } from "react";
interface GameList {
  href: string;
  icon: IconType;
  title: string;
  description: ReactNode;
}
export default function GameListSection({ limit }: { limit: number }) {
  const list: GameList[] = [
    {
      href: "/game/balanceGame",
      icon: FaBalanceScale,
      title: "밸런스 게임",
      description: (
        <>
          여러 선택지 중 <span className="font-bold text-indigo-400">최선</span>
          을 골라보자!
        </>
      ),
    },
    {
      href: "/game/tournamentGame",
      icon: FaTrophy,
      title: "토너먼트 게임",
      description: (
        <>
          여러 선택지 중 <span className="font-bold text-indigo-400">최애</span>
          를 골라보자!
        </>
      ),
    },
  ];
  return (
    <Section className="pb-10">
      <TitleSection title="게임" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
        {list.map((data, index) => (
          <GameCard
            key={data.title}
            href={data.href}
            icon={data.icon}
            title={data.title}
            description={data.description}
            delay={0.1 * (list.length + index)} // 순차적으로 딜레이 증가
          />
        ))}
      </div>
    </Section>
  );
}
