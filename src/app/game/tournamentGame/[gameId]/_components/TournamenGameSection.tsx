"use client";

import { TournamentGameProps, GameProps } from "@/app/types/gameType";

import gsap from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import { GameChoiceList } from "./GameChoiceList";
import { ResultView } from "./ResultView";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { QUERYKEYS } from "@/queryKeys";
import { useParams, useSearchParams } from "next/navigation";
import { getTournamenGameData } from "../_lib/getTournamenGameData";
import { useTournamentGame } from "@/hooks/useTournamentGame";
import useCounterUp from "@/hooks/useCounterUp";
import GameStartButton from "@/app/game/_components/GameStartButton";
import GameDesc from "@/app/game/_components/GameDesc";
import MoveStatisticsButton from "@/app/game/_components/MoveStatisticsButton";
import MoveListButton from "@/app/game/_components/MoveListButton";
import GameParticipate from "@/app/game/_components/GameParticipate";
import GameTitle from "@/app/game/_components/GameTitle";
import ShareButton from "@/app/_components/buttons/ShareButton";
import useKakaoShare from "@/hooks/useKakaoShare";

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

  const handleStart = async (e: React.MouseEvent<HTMLButtonElement>) => {
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

  // 랜덤 공유 메시지
  const shareMessages = [
    "🏆 내가 찾은 최고의 선택! 너는 어떤 걸 고를래?",
    "⚡️ 이상형 월드컵 결과가 예상과 다르다면? 너도 한번 도전해봐!",
    "🎮 취향을 테스트하는 가장 재미있는 방법! 너도 참여해볼래?",
    "🎯 내 취향 월드컵 결과 공개! 너의 선택은 뭐가 될지 궁금해~",
    "✨ 고민 끝에 찾은 내 최애! 친구들은 어떤 걸 선택할까?",
    "🎪 월드컵 게임 한판 어때? 의외의 결과가 나올지도!",
    "💫 이거 은근 고르기 어려웠는데... 너는 어떤 선택을 할지 궁금해!",
    "🎭 취향 월드컵 결과 대공개! 너도 한번 해보면 재미있을걸?",
    "🌟 내 취향 저격템을 찾았다! 친구들의 선택이 궁금하다면 참여해봐!",
    "🎨 이상형 월드컵 한판! 너의 최종 선택은 뭐가 될까?",
  ];
  const shareMessage =
    shareMessages[Math.floor(Math.random() * shareMessages.length)];

  const { handleKakaoShare } = useKakaoShare();

  const handlerShare = () => {
    handleKakaoShare({
      title: "월드컵 게임",
      description: shareMessage,
      shareUrl: `${window.location.origin}${window.location.pathname}`,
      imageUrl: data?.items[0].imageUrl || "",
    });
  };
  return (
    <motion.section
      className="flex items-center justify-center w-full min-h-dvh"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <AnimatePresence mode="wait">
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
                <motion.ul className="w-full h-full flex  items-stretch">
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
                        index={index}
                      />
                      {/* 하단광고 */}
                      {/* <div className="h-[50px] md:h-[100px] bg-zinc-900 flex items-center justify-center">
                        <div className="text-zinc-600 text-sm">광고 영역</div>
                      </div> */}
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
            className="max-w-md w-full mx-auto px-4 text-center space-y-4 py-24"
            variants={containerVariants}
          >
            <GameTitle title={data?.title || ""} />

            <GameStartButton handleStart={handleStart} />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <ShareButton
                variant="secondary"
                title={"친구에게 공유하기"}
                handlerShare={handlerShare}
              />
            </motion.div>
            <div className="">
              <GameDesc description="월드컵 방식으로 최후의 1개를 선택해주세요" />

              <GameParticipate rounded={rounded} />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-4"
            >
              <MoveListButton href="/game/tournamentGame" />{" "}
              <MoveStatisticsButton
                href={`/game/tournamentGame/${gameId}/statistics`}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
