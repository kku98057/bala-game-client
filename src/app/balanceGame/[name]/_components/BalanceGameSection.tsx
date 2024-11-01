"use client";

import { BalanceGameProps, GameProps } from "@/app/types/gameType";
import delay from "@/utils/delay";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { GameChoiceList } from "./GameChoiceList";
import { ResultView } from "./ResultView";
import { useBalanceGame } from "@/hooks/useBalanceGame";
import { FiPlay } from "react-icons/fi"; // 시작 아이콘
import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERYKEYS } from "@/queryKeys";
import { useParams } from "next/navigation";
import { getBalanceGameData } from "../_lib/getBalanceGameData";
import Link from "next/link";
import { postBalaceGameParticipageCountData } from "../_lib/postBalaceGameParticipageCountData";

export default function BalanceGameSection() {
  const { name: id } = useParams();
  const { data } = useQuery<BalanceGameProps>({
    queryKey: QUERYKEYS.balanceGame.list(Number(id)),
    queryFn: async () => getBalanceGameData(Number(id)),
  });
  const [isStart, setIsStart] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [userCount, setUserCount] = useState(0); // 사용자 수 상태 추가
  const { curGame, result, selectHandler, isSelecting } = useBalanceGame(
    data?.items || []
  );
  const sectionRef = useRef<HTMLDivElement>(null); // 섹션 참조 추가

  const ref = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const startTimeline = gsap.timeline();
  const resultTimeline = gsap.timeline();
  const firstTimeline = gsap.timeline();

  useEffect(() => {
    const end = data?.participantCount;
    const duration = 2; // 애니메이션 지속 시간 (초)

    // GSAP 애니메이션 설정
    gsap.to(
      { count: 0 },
      {
        count: end,
        delay: 1,
        duration: duration,
        ease: "power4.out", // 가속도 설정
        onUpdate: function () {
          setUserCount(Math.ceil(this.targets()[0].count)); // 현재 카운트 업데이트
        },
      }
    );
  }, [data?.participantCount]);
  useEffect(() => {
    if (ref.current && isStart) {
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
          duration: 1,
        },
      });

      // 초기 상태
      gsap.set([".game-choice-left", ".game-choice-right"], {
        opacity: 0,
        scale: 0.95,
      });

      tl.fromTo(
        ".game-choice-left",
        {
          x: "-100%",
          opacity: 0,
          scale: 0.95,
        },
        {
          x: 0,
          opacity: 1,
          scale: 1,
        }
      ).fromTo(
        ".game-choice-right",
        {
          x: "100%",
          opacity: 0,
          scale: 0.95,
        },
        {
          x: 0,
          opacity: 1,
          scale: 1,
        },
        "-=0.8"
      );
    }
  }, [isStart]);
  const { mutate: participantCountHandler, isPending } = useMutation({
    mutationFn: ({ id }: { id: number }) =>
      postBalaceGameParticipageCountData(id),
    mutationKey: QUERYKEYS.balanceGame.participantCount(Number(id)),
  });

  const handleStart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    participantCountHandler(
      {
        id: Number(id),
      },
      {
        onSuccess: () => {
          setIsStart(true);
          const timeline = gsap.timeline({ repeat: 3 });
          timeline
            .to(e.currentTarget, {
              scale: 0.95,
              duration: 0.15,
            })
            .to(e.currentTarget, {
              scale: 1,
              duration: 0.15,
            });
        },
      }
    );
  };

  useEffect(() => {
    if (sectionRef.current) {
      firstTimeline.to(".game_title", {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "bounce.out", // 화려한 애니메이션 효과
      });
    }
    return () => {
      firstTimeline.kill();
      startTimeline.kill();
      resultTimeline.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="flex items-center justify-center w-full min-h-dvh "
    >
      {isStart ? (
        <div ref={ref} className="relative w-full h-full overflow-hidden">
          {curGame.length > 0 && !result && (
            <>
              <ul className="w-full flex items-center h-dvh">
                {curGame.slice(0, 2).map((list: GameProps, index) => (
                  <li
                    key={`${list.name}_${name}`}
                    className={`game-choice overflow-hidden ${
                      index === 0 ? "game-choice-left" : "game-choice-right"
                    } flex-1 h-full`}
                  >
                    <GameChoiceList
                      list={list}
                      onSelect={selectHandler}
                      curGame={curGame}
                      isSelecting={isSelecting}
                    />
                  </li>
                ))}
              </ul>
              <button
                onClick={() => window.location.reload()}
                className="absolute top-[100px] bg-indigo-600 p-[15px] rounded-full left-[50%] translate-x-[-50%] z-[10] text-white hover:bg-indigo-700 transition-colors duration-200 shadow-lg"
              >
                다시 시작하기
              </button>
            </>
          )}

          {result && <ResultView result={result} resultRef={resultRef} />}
        </div>
      ) : (
        <div className="game_title opacity-0 scale-[0.5] max-w-md w-full mx-auto px-4 text-center space-y-8">
          <h1 className="  start-title text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
            당신의 선택은?
            <br />
            <span className=" text-indigo-400">{data?.title}</span>
          </h1>

          <button
            type="button"
            disabled={isPending}
            onClick={handleStart}
            className="start-button  group relative w-full flex items-center justify-center py-6 px-8 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiPlay className="mr-3 text-2xl" />
            <span className="text-2xl">
              {isPending ? "시작중.." : "시작하기"}
            </span>
            <div className="absolute inset-0 rounded-xl border-2 border-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </button>

          <p className="text-zinc-400 text-sm mt-6">
            두 가지 선택지 중 하나를 골라주세요
          </p>
          <p className="text-white text-lg mt-4">
            참가 유저 수:{" "}
            <span className="font-bold">{userCount.toLocaleString()}</span>
          </p>
          <Link
            href="/balanceGame"
            className="inline-block mt-8 px-6 py-3 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-white transition-colors duration-200"
          >
            목록으로 돌아가기
          </Link>
        </div>
      )}
    </section>
  );
}
