"use client";
import { QUERYKEYS } from "@/queryKeys";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef } from "react";
import balanceGameListData from "../_lib/balanceGameListData";
import Link from "next/link";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import Image from "next/image";
import { BalanceGameListResponse } from "@/app/types/gameType";

export default function BalaceGameListSection() {
  const observerRef = useRef<HTMLDivElement>(null);
  const limit = 10;

  const { data, fetchNextPage, hasNextPage, isLoading } =
    useInfiniteQuery<BalanceGameListResponse>({
      queryKey: QUERYKEYS.balanceGame.lists({ limit }),
      queryFn: ({ pageParam = 1 }) =>
        balanceGameListData({ page: pageParam, limit }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const { currentPage, totalPages } = lastPage;
        return currentPage < totalPages ? currentPage + 1 : undefined;
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
  console.log(data);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-48">
      <div className="flex flex-col items-center justify-between mb-24 sm:flex-row sm:items-end">
        <h1 className="text-4xl font-semibold text-white mb-6 sm:mb-0">
          밸런스 게임 리스트
        </h1>
        <Link
          href="/balanceGame/create"
          className="group flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white rounded-xl hover:bg-[#1D4ED8] transition-all duration-300"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="font-medium">게임 만들기</span>
        </Link>
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
                  {game.title}
                </h3>

                {/* 작성자 정보와 날짜 */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="font-medium">{game.username}</span>
                  <time className="text-gray-400">
                    {new Date(game.createdAt).toLocaleDateString()}
                  </time>
                </div>

                {/* VS 이미지 프리뷰 */}
                <div className="flex items-center justify-center gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src={game.items[0].imageUrl}
                      alt={game.items[0].name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="font-bold text-gray-400">VS</span>
                  <div className="relative w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src={game.items[1].imageUrl}
                      alt={game.items[1].name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      <div ref={observerRef} className="w-full h-20" />
    </section>
  );
}
