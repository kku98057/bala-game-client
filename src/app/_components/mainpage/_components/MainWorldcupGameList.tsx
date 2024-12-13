"use client";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { QUERYKEYS } from "@/queryKeys";
import Section from "../../Section";
import getTournamenGameListData from "@/app/game/tournamentGame/_lib/getTournamenGameListData";
import { TournamentListResponse } from "@/app/types/gameType";
import TournamentGameCard, {
  TournamentGameCardSkeleton,
} from "@/app/game/tournamentGame/_components/TournamentGameCard";
import Link from "next/link";
import { SwiperOptions } from "swiper/types";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import GoogleAdSenseComponent2 from "../../adsense/GoogleAdSenseComponent2";

export default function MainWorldcupGameList() {
  const limit = 5;

  // 쿼리 설정을 상수로 분리
  const queryOptions = {
    limit,
    sort: "popular" as const,
    period: "all" as const,
  };

  const { data, isLoading } = useQuery<TournamentListResponse>({
    queryKey: QUERYKEYS.tournamentGame.lists(queryOptions),
    queryFn: () =>
      getTournamenGameListData({
        ...queryOptions,
        page: 1,
      }),
  });

  // Swiper 설정을 상수로 분리하여 재사용
  const swiperConfig: SwiperOptions = {
    modules: [Pagination, Autoplay],
    spaceBetween: 30,
    slidesPerView: "auto",
    pagination: {
      clickable: true,
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
  };

  return (
    <Section variant="secondary">
      <GoogleAdSenseComponent2 />
      <div className="flex items-center justify-between mb-0 ">
        <h2 className="text-xl sm:text-3xl font-bold text-white">
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

      <div className="relative pb-4">
        <Swiper {...swiperConfig} className="!pb-[40px] !pt-[10px]">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <SwiperSlide
                  key={`이상형월드컵스켈레톤_${index}`}
                  className="py-[20px] max-w-[478px] mr-[30px]"
                >
                  <TournamentGameCardSkeleton />
                </SwiperSlide>
              ))
            : data?.games.map((game, index) => (
                <SwiperSlide
                  key={`이상형월드컵_${game.id}`}
                  className="py-[20px] max-w-[478px]"
                >
                  <TournamentGameCard
                    key={game.id}
                    game={game}
                    rank={index + 1}
                  />
                </SwiperSlide>
              ))}
        </Swiper>
      </div>
    </Section>
  );
}
