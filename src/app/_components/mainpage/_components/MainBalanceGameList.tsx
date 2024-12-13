"use client";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { BalanceGameCardSkeleton } from "@/app/game/balanceGame/_components/BalanceGameCard";
import Section from "../../Section";
import { QUERYKEYS } from "@/queryKeys";
import getBalanceGameListData from "@/app/game/balanceGame/_lib/getBalanceGameListData";
import { BalanceGameListResponse } from "@/app/types/balanceGameType";
import BalanceGameCard from "@/app/game/balanceGame/_components/BalanceGameCard";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import { SwiperOptions } from "swiper/types";
import GoogleAdSenseComponent from "../../adsense/GoogleAdSenseComponent";

import GoogleAdSenseComponent2 from "../../adsense/GoogleAdSenseComponent2";

export default function MainBalanceGameList() {
  const limit = 5;

  const { data, isLoading } = useQuery<BalanceGameListResponse>({
    queryKey: QUERYKEYS.balanceGame.lists({
      limit,
      sort: "popular",
      period: "all",
    }),
    queryFn: () =>
      getBalanceGameListData({
        limit,
        sort: "popular",
        period: "all",
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
    <>
      <Section variant="secondary">
        <ins
          className="adsbygoogle example_responsive_1"
          style={{ display: "block" }}
          data-ad-client="ca-pub-3604338976078798"
          data-ad-slot="6734164461"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        <div className="flex items-center justify-between mb-0 sm:mb-6">
          <h2 className="text-xl sm:text-3xl font-bold text-white">
            인기 밸런스게임
          </h2>
          <Link
            href="/game/balanceGame"
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

        <div className="relative pb-2">
          <Swiper {...swiperConfig} className="!pb-[40px] !pt-[10px]">
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <SwiperSlide
                    key={`밸런스게임스켈레톤_${index}`}
                    className="py-[10px] max-w-[478px] mr-[30px]"
                  >
                    <BalanceGameCardSkeleton />
                  </SwiperSlide>
                ))
              : data?.games.map((game, index) => (
                  <SwiperSlide
                    key={`밸런스게임_${game.id}`}
                    className="py-[10px] max-w-[478px]"
                  >
                    <BalanceGameCard game={game} rank={index + 1} />
                  </SwiperSlide>
                ))}
          </Swiper>
        </div>
      </Section>
    </>
  );
}
