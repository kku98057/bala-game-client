"use client";

import { TournamentGameProps, GameProps } from "@/app/types/gameType";

import gsap from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import { GameChoiceList } from "./GameChoiceList";
import { ResultView } from "./ResultView";
import { motion } from "framer-motion";
import { FiPlay } from "react-icons/fi"; // 시작 아이콘
import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERYKEYS } from "@/queryKeys";
import { useParams, useSearchParams } from "next/navigation";
import { getTournamenGameData } from "../_lib/getTournamenGameData";
import Link from "next/link";
import { postTournamentGameParticipageCountData } from "../_lib/postTournamentGameParticipageCountData";
import { useTournamentGame } from "@/hooks/useTournamentGame";
import useCounterUp from "@/hooks/useCounterUp";

export default function TournamenGameSection() {
  const { gameId } = useParams();
  const { data } = useQuery<TournamentGameProps>({
    queryKey: QUERYKEYS.tournamentGame.list(Number(gameId)),
    queryFn: async () => getTournamenGameData(Number(gameId)),
  });
  const [isStart, setIsStart] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // 애니메이션 상태 추가
  const searchParams = useSearchParams();
  const resultId = searchParams.get("result");

  const {
    curGame,
    result,
    selectHandler,
    isSelecting,
    currentRound,
    setResult,
  } = useTournamentGame(data?.items || [], gameId || "0");
  const sectionRef = useRef<HTMLDivElement>(null); // 섹션 참조 추가

  const ref = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const startTimeline = gsap.timeline();
  const resultTimeline = gsap.timeline();
  const firstTimeline = gsap.timeline();
  // 라운드 시작 애니메이션
  const showRoundAnimation = useCallback(() => {
    setIsAnimating(true); // 애니메이션 시작
    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false); // 애니메이션 완료
      },
    });

    tl.fromTo(
      ".round-announcement",
      {
        scale: 2,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "back.out",
      }
    ).to(".round-announcement", {
      opacity: 0,
      delay: 1,
      duration: 0.3,
    });
  }, []);

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
      postTournamentGameParticipageCountData(id),
    mutationKey: QUERYKEYS.tournamentGame.participantCount(Number(gameId)),
  });

  const handleStart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    participantCountHandler(
      {
        id: Number(gameId),
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
    if (currentRound && isStart && !result) {
      showRoundAnimation();
    }
  }, [currentRound, isStart, result]);

  useEffect(() => {
    if (sectionRef.current) {
      firstTimeline.to(".game_title", {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "bounce.out",
      });
    }
    return () => {
      firstTimeline.kill();
      startTimeline.kill();
      resultTimeline.kill();
    };
  }, []);
  useEffect(() => {
    // 공유된 결과가 있는 경우
    if (resultId && data?.items) {
      const sharedResult = data.items.find(
        (item) => item.id === Number(resultId)
      );
      if (sharedResult) {
        // 결과 화면 바로 표시
        setIsStart(true);
        // 공유된 결과를 보여줌
        setResult(sharedResult);
      }
    }
  }, [resultId, data]);
  const { rounded } = useCounterUp(data?.participantCount as number);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const roundAnnouncementVariants = {
    hidden: { opacity: 0, scale: 2 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "backOut",
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };
  return (
    <motion.section
      className="flex items-center justify-center w-full min-h-dvh"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {isStart ? (
        <div className="relative w-full h-full overflow-hidden">
          {currentRound && !result && (
            <div className="round-announcement fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50  md:w-auto">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white bg-indigo-600 px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-lg shadow-lg whitespace-nowrap text-center">
                {currentRound} 시작!
              </h2>
            </div>
          )}

          {curGame.length > 0 && !result && (
            <>
              <motion.ul className="w-full h-full flex flex-col md:flex-row items-stretch">
                {curGame.slice(0, 2).map((list: GameProps, index) => (
                  <motion.li
                    key={`${list.id}_선택지`}
                    initial={{
                      x: index === 0 ? -100 : 100,
                      opacity: 0,
                    }}
                    animate={{
                      x: 0,
                      opacity: 1,
                    }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.2,
                      ease: "easeOut",
                    }}
                    className={`relative flex-1`}
                  >
                    <GameChoiceList
                      list={list}
                      onSelect={selectHandler}
                      curGame={curGame}
                      isSelecting={isSelecting}
                      disabled={isAnimating}
                    />
                  </motion.li>
                ))}
              </motion.ul>

              <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  z-20">
                <div className="bg-white/10 backdrop-blur-lg rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                  <span className="text-xl md:text-2xl font-bold text-white">
                    VS
                  </span>
                </div>
              </div>
            </>
          )}

          {result && <ResultView result={result} resultRef={resultRef} />}
        </div>
      ) : (
        <motion.div
          className="max-w-md w-full mx-auto px-4 text-center space-y-8 py-24"
          variants={containerVariants}
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight"
            variants={titleVariants}
          >
            당신의 선택은?
            <br />
            <motion.span className="text-indigo-400" variants={titleVariants}>
              {data?.title}
            </motion.span>
          </motion.h1>

          <motion.button
            type="button"
            disabled={isPending}
            onClick={handleStart}
            className="group relative w-full flex items-center justify-center py-6 px-8 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            variants={titleVariants}
          >
            <FiPlay className="mr-3 text-2xl" />
            <span className="text-2xl">
              {isPending ? "시작중.." : "시작하기"}
            </span>
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-zinc-400 text-sm mt-6"
          >
            두 가지 선택지 중 하나를 골라주세요
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-white text-lg"
          >
            참여자 수:{" "}
            <motion.span
              className="font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {rounded}
            </motion.span>
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <Link
              href="/game/tournamentGame"
              className="inline-block px-6 py-3 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-white transition-all duration-200 hover:scale-105"
            >
              목록으로 돌아가기
            </Link>
          </motion.div>
        </motion.div>
      )}
    </motion.section>
  );
}
