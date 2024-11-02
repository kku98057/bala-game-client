"use client";
import { QUERYKEYS } from "@/queryKeys";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef } from "react";
import balanceGameListData from "../_lib/balanceGameListData";
import Link from "next/link";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import Image from "next/image";
import { BalanceGameListResponse } from "@/app/types/gameType";
import CustomLink from "@/app/_components/buttons/CustomLink";
import Section from "@/app/_components/Section";
import TitleText from "@/app/_components/TitleText";

export default function BalaceGameListSection({ limit }: { limit: number }) {
  const observerRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isLoading } =
    useInfiniteQuery<BalanceGameListResponse>({
      queryKey: QUERYKEYS.balanceGame.lists({ limit }),
      queryFn: ({ pageParam = 1 }) =>
        balanceGameListData({ page: pageParam, limit }),
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
      <div className="flex flex-col items-center justify-between mb-24 sm:flex-row sm:items-end">
        <TitleText>밸런스 게임 리스트</TitleText>
        <CustomLink href="/balanceGame/create" icon="plus">
          <span className="font-medium">게임 만들기</span>
        </CustomLink>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {data?.pages.map((page) =>
          page.games.map((game) => (
            <Link
              key={game.id}
              href={`/balanceGame/${game.id}`}
              className="group bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:bg-gray-50"
            >
              {/* 썸네일 이미지 */}
              <div className="relative w-full h-64">
                <Image
                  src={game.items[0].imageUrl}
                  alt={game.items[0].name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              <div className="p-6">
                {/* 제목 */}
                <h3 className="text-xl font-medium mb-3 truncate">
                  <span className="text-blue-500 font-bold">
                    [{game.itemsCount as number}강전]
                  </span>
                  {game.title}
                </h3>

                {/* 작성자 정보와 날짜 */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="font-medium">{game.username}</span>
                  <time className="text-gray-400">
                    {new Date(game.createdAt).toLocaleDateString()}
                  </time>
                </div>
                {/* 참여자 수 */}
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <span>{game.participantCount.toLocaleString()}명 참여</span>
                </div>
                {/* VS 이미지 프리뷰 */}
                <div className="flex items-center justify-center gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src={game.items[0].imageUrl}
                      alt={game.items[0].name}
                      fill
                      className="object-cover"
                      sizes="100%"
                    />
                  </div>
                  <span className="font-bold text-gray-400">VS</span>
                  <div className="relative w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src={game.items[1].imageUrl}
                      alt={game.items[1].name}
                      fill
                      className="object-cover"
                      sizes="100%"
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      <div ref={observerRef} className="w-full h-20" />
    </Section>
  );
}
