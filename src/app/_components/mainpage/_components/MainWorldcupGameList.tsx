"use client";
import { useQuery } from "@tanstack/react-query";

import { QUERYKEYS } from "@/queryKeys";

import Section from "../../Section";
// Swiper 스타일 import
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import getTournamenGameListData from "@/app/game/tournamentGame/_lib/getTournamenGameListData";
import { TournamentListResponse } from "@/app/types/gameType";
import TournamentGameCard, {
  TournamentGameCardSkeleton,
} from "@/app/game/tournamentGame/_components/TournamentGameCard";
import Loading from "../../Loading";
import Link from "next/link";
export default function MainWorldcupGameList() {
  const limit = 5;
  const { data, isLoading } = useQuery<TournamentListResponse>({
    queryKey: QUERYKEYS.tournamentGame.lists({ limit, sort: "popular" }),
    queryFn: () =>
      getTournamenGameListData({ limit, sort: "popular", page: 1 }),
  });
  return (
    <Section variant="secondary" className="pb-20">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl font-bold text-white text-left">
          인기 이상형월드컵
        </h2>
        <Link
          href="/game/tournamentGame"
          className="inline-flex items-center gap-1 px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          더보기
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>

      {isLoading ? (
        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={"auto"}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          className="!pb-[40px]" // 클래스 이름 변경
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <SwiperSlide
              key={`이상형월드컵스켈레톤_${index}`}
              className="py-[20px] max-w-[478px] w-full mr-[30px]"
            >
              <TournamentGameCardSkeleton />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="relative pb-12 ">
          {/* 페이지네이션을 위한 여백 */}
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={"auto"}
            pagination={{
              clickable: true,
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            className="!pb-[40px]" // 클래스 이름 변경
          >
            {data?.games.map((game) => (
              <SwiperSlide
                key={`이상형월드컵_${game.id}`}
                className="py-[20px] max-w-[478px]   w-full"
              >
                <TournamentGameCard key={game.id} game={game} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </Section>
  );
}
