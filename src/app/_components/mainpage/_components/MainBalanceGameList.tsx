"use client";
import { useQuery } from "@tanstack/react-query";
import Container from "../../Container";
import { motion } from "framer-motion";
import { QUERYKEYS } from "@/queryKeys";
import getBalanceGameListData from "@/app/game/balanceGame/_lib/getBalanceGameListData";
import { BalanceGameListResponse } from "@/app/types/balanceGameType";
import BalanceGameCard from "@/app/game/balanceGame/_components/BalanceGameCard";
import Section from "../../Section";
// Swiper 스타일 import
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Loading from "../../Loading";
export default function BalanceGameList() {
  const limit = 5;
  const { data, isLoading } = useQuery<BalanceGameListResponse>({
    queryKey: QUERYKEYS.balanceGame.lists({ limit, sort: "popular" }),
    queryFn: () => getBalanceGameListData({ limit, sort: "popular", page: 1 }),
  });
  return (
    <Section>
      <h2 className="text-3xl font-bold text-white mb-12 text-left ">
        인기 밸런스게임
      </h2>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="relative pb-12 ">
          {" "}
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
              <SwiperSlide key={game.id} className="py-[10px] max-w-[478px]">
                <BalanceGameCard game={game} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </Section>
  );
}
