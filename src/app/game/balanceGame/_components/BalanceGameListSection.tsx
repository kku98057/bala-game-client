"use client";
import { QUERYKEYS } from "@/queryKeys";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import CustomLink from "@/app/_components/buttons/CustomLink";
import Section from "@/app/_components/Section";
import BalanceGameCard from "./BalanceGameCard";
import getBalanceGameListData from "../_lib/getBalanceGameListData";
import { BalanceGameListResponse } from "@/app/types/balanceGameType";
import TitleSection from "@/app/_components/TitleSection";
import Loading from "@/app/_components/Loading";

export default function BalanceGameListSection({ limit }: { limit: number }) {
  const observerRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isLoading } =
    useInfiniteQuery<BalanceGameListResponse>(
      QUERYKEYS.balanceGame.lists({ limit, sort: "latest" }),
      ({ pageParam = 1 }) =>
        getBalanceGameListData({ page: pageParam, limit, sort: "latest" }),
      {
        getNextPageParam: (lastPage) => {
          if (!lastPage?.games) return undefined;
          if (!lastPage.currentPage || !lastPage.totalPages) return undefined;
          return lastPage.currentPage < lastPage.totalPages
            ? lastPage.currentPage + 1
            : undefined;
        },
      }
    );

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
    return <Loading overlay />;
  }
  return (
    <Section>
      <TitleSection title="밸런스 게임">
        <CustomLink
          className="w-full sm:w-auto justify-center text-center px-6 py-3"
          href="/game/balanceGame/create"
          icon="plus"
          iconPosition="right"
        >
          게임 만들기
        </CustomLink>{" "}
        <CustomLink
          className="w-full sm:w-auto justify-center text-center px-6 py-3"
          href="/game"
          icon="arrow"
          iconPosition="right"
        >
          게임 카테고리
        </CustomLink>
      </TitleSection>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {data?.pages.map((page, pageIndex) =>
          page.games.map((game, index) => (
            <BalanceGameCard
              isDelete
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
