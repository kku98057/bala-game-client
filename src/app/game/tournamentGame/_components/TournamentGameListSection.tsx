"use client";
import { QUERYKEYS } from "@/queryKeys";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef } from "react";
import getTournamenGameListData from "../_lib/getTournamenGameListData";
import Link from "next/link";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { motion } from "framer-motion";
import { TournamentListResponse } from "@/app/types/gameType";
import CustomLink from "@/app/_components/buttons/CustomLink";
import Section from "@/app/_components/Section";
import TitleText from "@/app/_components/TitleText";
import TournamentGameCard from "./TournamentGameCard";

export default function TournamentGameListSection({
  limit,
}: {
  limit: number;
}) {
  const observerRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isLoading } =
    useInfiniteQuery<TournamentListResponse>({
      queryKey: QUERYKEYS.tournamentGame.lists({ limit }),
      queryFn: ({ pageParam = 1 }) =>
        getTournamenGameListData({ page: pageParam, limit }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (!lastPage?.games) return undefined;
        if (!lastPage.currentPage || !lastPage.totalPages) return undefined;
        return lastPage.currentPage < lastPage.totalPages
          ? lastPage.currentPage + 1
          : undefined;
      },
    });

  const onIntersect = ([entry]: IntersectionObserverEntry[]) => {
    if (entry.isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  };

  useIntersectionObserver({
    ref: observerRef,
    callback: onIntersect,
  });
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }
  return (
    <Section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-between mb-24 sm:flex-row sm:items-end"
      >
        <TitleText>토너먼트 게임 리스트</TitleText>
        <CustomLink href="/game/tournamentGame/create" icon="plus">
          <span className="font-medium">게임 만들기</span>
        </CustomLink>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {data?.pages.map((page, pageIndex) =>
          page.games.map((game, index) => (
            <TournamentGameCard
              key={game.id}
              game={game}
              delay={0.1 * (pageIndex * page.games.length + index)} // 순차적으로 딜레이 증가
            />
          ))
        )}
      </div>

      <div ref={observerRef} className="w-full h-20" />
    </Section>
  );
}
