"use client";

import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERYKEYS } from "@/queryKeys";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import Link from "next/link";
import QuestionList from "./QuestionList";
import { getBalanceGameData } from "../_lib/getBalanceGameData";
import { postBanaceGameParticipageCountData } from "../_lib/postBanaceGameParticipageCountData";
import {
  motion,
  AnimatePresence,
  animate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import useCounterUp from "@/hooks/useCounterUp";
import { FiPlay } from "react-icons/fi";

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
      className="flex items-center justify-center w-full min-h-dvh py-24"
    >
      <AnimatePresence mode="wait">
        {!isStart ? (
          <motion.div
            key="start-screen"
            className="max-w-md w-full mx-auto px-4 text-center space-y-12"
          >
            <motion.h1 className="text-4xl md:text-5xl font-bold text-white mb-12 leading-tight">
              당신의 선택은?
              <br />
              <motion.span
                className="text-indigo-400 mt-3 block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {data.title}
              </motion.span>
            </motion.h1>

            <div className="py-4">
              <motion.button
                type="button"
                disabled={isPending}
                onClick={handleStart}
                className="group relative w-full flex items-center justify-center py-7 px-8 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiPlay className="mr-3 text-2xl" />
                <span className="text-2xl">
                  {isPending ? "시작중.." : "시작하기"}
                </span>
                <div className="absolute inset-0 rounded-xl border-2 border-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </motion.button>
            </div>

            <div className="space-y-8">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-zinc-400 text-sm py-2"
              >
                각 질문에서 더 끌리는 선택지를 골라주세요
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-white text-lg py-2"
              >
                참여자 수:{" "}
                <motion.span
                  className="font-bold text-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  {rounded}
                </motion.span>
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-4"
            >
              <Link
                href="/game/balanceGame"
                className="group relative inline-flex items-center gap-2 px-6 py-3 bg-zinc-800/50 backdrop-blur hover:bg-zinc-700/50 rounded-xl text-zinc-300 hover:text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-zinc-950/20"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                목록으로 돌아가기
                <div className="absolute inset-0 rounded-xl border border-zinc-700/50 group-hover:border-zinc-500/50 transition-colors duration-300" />
              </Link>

              <Link
                href={`/game/balanceGame/${gameId}/statistics`}
                className="group relative inline-flex items-center gap-2 px-6 py-3 bg-indigo-600/90 backdrop-blur hover:bg-indigo-600 rounded-xl text-indigo-200 hover:text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-indigo-950/20"
              >
                <span>통계 보러가기</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <div className="absolute inset-0 rounded-xl border border-indigo-500/50 group-hover:border-indigo-400/50 transition-colors duration-300" />
              </Link>
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
