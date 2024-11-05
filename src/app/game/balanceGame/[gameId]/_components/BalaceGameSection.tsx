"use client";

import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERYKEYS } from "@/queryKeys";
import { useState } from "react";
import gsap from "gsap";
import Link from "next/link";
import QuestionList from "./QuestionList";
import { getBalanceGameData } from "../_lib/getBalanceGameData";
import { postBanaceGameParticipageCountData } from "../_lib/postBanaceGameParticipageCountData";
import { motion, AnimatePresence } from "framer-motion";
import useCounterUp from "@/hooks/useCounterUp";
import { FiPlay } from "react-icons/fi";
import GameStartButton from "@/app/game/_components/GameStartButton";
import GameDesc from "@/app/game/_components/GameDesc";
import MoveStatisticsButton from "@/app/game/_components/MoveStatisticsButton";
import MoveListButton from "@/app/game/_components/MoveListButton";
import GameParticipate from "@/app/game/_components/GameParticipate";
import GameTitle from "@/app/game/_components/GameTitle";

export default function BalanceGameSection() {
  const { gameId } = useParams();
  const [isStart, setIsStart] = useState(false);

  const { data } = useQuery({
    queryKey: QUERYKEYS.balanceGame.list(Number(gameId)),
    queryFn: () => getBalanceGameData(Number(gameId)),
  });

  const { mutate: participantCountHandler, isPending } = useMutation({
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
            <GameStartButton isPending={isPending} handleStart={handleStart} />
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
