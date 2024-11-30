"use client";

import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERYKEYS } from "@/queryKeys";
import { useState } from "react";
import gsap from "gsap";
import QuestionList from "./QuestionList";
import { getBalanceGameData } from "../_lib/getBalanceGameData";
import { postBanaceGameParticipageCountData } from "../_lib/postBanaceGameParticipageCountData";
import { motion, AnimatePresence } from "framer-motion";
import useCounterUp from "@/hooks/useCounterUp";
import GameStartButton from "@/app/game/_components/GameStartButton";
import GameDesc from "@/app/game/_components/GameDesc";
import MoveStatisticsButton from "@/app/game/_components/MoveStatisticsButton";
import MoveListButton from "@/app/game/_components/MoveListButton";
import GameParticipate from "@/app/game/_components/GameParticipate";
import GameTitle from "@/app/game/_components/GameTitle";
import useKakaoShare from "@/hooks/useKakaoShare";
import ShareButton from "@/app/_components/buttons/ShareButton";

export default function BalanceGameSection() {
  const { gameId } = useParams();
  const [isStart, setIsStart] = useState(false);

  const { data } = useQuery({
    queryKey: QUERYKEYS.balanceGame.list(Number(gameId)),
    queryFn: () => getBalanceGameData(Number(gameId)),
  });

  const { mutate: participantCountHandler, isLoading } = useMutation({
    mutationFn: ({ id }: { id: number }) =>
      postBanaceGameParticipageCountData(id),
    mutationKey: QUERYKEYS.balanceGame.participantCount(Number(gameId)),
  });
  const handleStart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    participantCountHandler(
      {
        id: Number(gameId),
      },
      {
        onSuccess: () => {
          setIsStart(true);
          gsap.to(".start-screen", {
            y: -20,
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
              setIsStart(true);
              gsap.fromTo(
                ".question-list",
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5 }
              );
            },
          });
        },
      }
    );
  };

  const { rounded } = useCounterUp(data?.participantCount);

  const { handleKakaoShare } = useKakaoShare();
  const shareMessages = [
    "🤔 이거 진짜 고민되는데... 너라면 뭐 골라?",
    "⚖️ 밸런스 게임 한판! 너의 선택은?",
    "🎮 진짜 미친 선택지인데 너는 어떻게 할래?",
    "🔥 이거 완전 극과 극인데... 고민된다면 직접 해봐!",
    "💫 밸런스 게임 하다가 머리 터질 것 같아! 너도 도전해볼래?",
    "🎯 찐 밸런스 게임이 왔다! 너의 선택이 궁금해~",
    "🎪 이번 밸런스 게임은 레전드인데? 한번 골라봐!",
    "✨ A vs B, 너라면 어떤 걸 선택할래?",
    "🌟 이거 진짜 미친 선택지인데... 너도 한번 골라봐!",
    "🎭 인생이 걸린 선택의 순간... 너의 선택은?",
  ];
  const shareMessage =
    shareMessages[Math.floor(Math.random() * shareMessages.length)];

  const handlerShare = () => {
    handleKakaoShare({
      title: data.title,
      description: shareMessage,
      shareUrl: `${window.location.origin}${window.location.pathname}`,
      imageUrl: `${window.location.origin}/imgs/balancegame.png`,
    });
  };
  if (!data) return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center w-full min-h-dvh"
    >
      <AnimatePresence mode="wait">
        {!isStart ? (
          <motion.div
            key="start-screen"
            className="max-w-md w-full mx-auto px-4 text-center space-y-4"
          >
            <GameTitle title={data?.title || ""} />

            <GameStartButton isPending={isLoading} handleStart={handleStart} />
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
              <GameDesc description="각 질문에서 더 끌리는 선택지를 골라주세요" />
              <GameParticipate rounded={rounded} />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-4"
            >
              <MoveListButton href="/game/balanceGame" />
              <MoveStatisticsButton
                href={`/game/balanceGame/${gameId}/statistics`}
              />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="question-list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <QuestionList questions={data.questions} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
