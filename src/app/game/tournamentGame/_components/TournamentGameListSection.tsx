"use client";
import { QUERYKEYS } from "@/queryKeys";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef } from "react";
import getTournamenGameListData from "../_lib/getTournamenGameListData";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { TournamentListResponse } from "@/app/types/gameType";
import CustomLink from "@/app/_components/buttons/CustomLink";
import Section from "@/app/_components/Section";
import TournamentGameCard from "./TournamentGameCard";
import TitleSection from "@/app/_components/TitleSection";

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
        <div className="w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return (
    <Section>
      <TitleSection title="월드컵 게임">
        <CustomLink
          href="/game/tournamentGame/create"
          icon="plus"
          iconPosition="right"
          className="w-full sm:w-auto justify-center text-center px-6 py-3"
        >
          게임 만들기
        </CustomLink>

        <CustomLink
          href="/game"
          icon="arrow"
          iconPosition="right"
          className="w-full sm:w-auto justify-center text-center px-6 py-3"
        >
          게임 목록
        </CustomLink>
      </TitleSection>

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
