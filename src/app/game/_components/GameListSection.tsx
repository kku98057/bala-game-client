"use client";
import Link from "next/link";

import Image from "next/image";
import { BiShuffle } from "react-icons/bi"; // 밸런스 게임 아이콘
import { motion } from "framer-motion";

import CustomLink from "@/app/_components/buttons/CustomLink";
import Section from "@/app/_components/Section";
import TitleText from "@/app/_components/TitleText";
import { FaTrophy } from "react-icons/fa";
import GameCard from "./GameCard";
import { IconType } from "react-icons";
interface GameList {
  href: string;
  icon: IconType;
  title: string;
  description: string;
}
export default function GameListSection({ limit }: { limit: number }) {
  const list: GameList[] = [
    {
      href: "/game/tournamentGame",
      icon: FaTrophy,
      title: "토너먼트 게임",
      description:
        "여러 선택지 중 최고의 선택을 가려내는 토너먼트를 즐겨보세요",
    },
  ];
  return (
    <Section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-between mb-24 sm:flex-row sm:items-end"
      >
        <TitleText>토너먼트 게임 리스트</TitleText>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
        {list.map((data, index) => (
          <GameCard
            key={""}
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
