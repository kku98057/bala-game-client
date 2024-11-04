"use client";
import Link from "next/link";

import Section from "@/app/_components/Section";
import { FaTrophy } from "react-icons/fa";
import GameCard from "./GameCard";
import { IconType } from "react-icons";
import TitleSection from "@/app/_components/TitleSection";
interface GameList {
  href: string;
  icon: IconType;
  title: string;
  description: string;
}
export default function GameListSection({ limit }: { limit: number }) {
  const list: GameList[] = [
    {
      href: "/game/balanceGame",
      icon: FaTrophy,
      title: "밸런스 게임",
      description: `여러 선택지 중 최고의 선택을 가려내는\n 밸런스 게임을 즐겨보세요`,
    },
    {
      href: "/game/tournamentGame",
      icon: FaTrophy,
      title: "토너먼트 게임",
      description: `여러 선택지 중 최고의 선택을 가려내는\n 토너먼트를 즐겨보세요`,
    },
  ];
  return (
    <Section>
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
