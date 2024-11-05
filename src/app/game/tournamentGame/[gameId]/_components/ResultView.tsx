import { GameProps } from "@/app/types/gameType";
import confetti from "canvas-confetti";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiShare2, FiBarChart2 } from "react-icons/fi"; // 아이콘 사용
import useKakaoShare from "@/hooks/useKakaoShare";
import ShareButton from "@/app/_components/buttons/ShareButton";

export const ResultView = ({
  result,
  resultRef,
}: {
  result: GameProps;
  resultRef: React.RefObject<HTMLDivElement>;
}) => {
  const { gameId } = useParams();

  // 랜덤 결과 메시지 선택
  const resultMessages = [
    `당신의 선택은 "${result.name}"! 센스가 아주 좋으시네요 👍`,
    `"${result.name}" 특급 안목이십니다! 👀`,
    `역시! "${result.name}"만한 게 없죠! ⭐`,
    `"${result.name}" 찍으신 분? 당신이군요! 🎯`,
    `오늘의 승자는 "${result.name}"입니다! 🏆`,
  ];

  // 랜덤 공유 메시지
  const shareMessages = [
    `내가 골라도 "${result.name}"을(를) 고르겠어!`,
    `이거 실화? 내가 고른 "${result.name}" 어때요?`,
    `고민 끝에 선택한 "${result.name}", 당신의 선택은?`,
    `"${result.name}" 찍은 사람 여기 있네요!`,
    `월드컵계 끝판왕의 선택 "${result.name}"`,
  ];

  const [randomMessage, setRandomMessage] = useState("");
  useEffect(() => {
    setRandomMessage(
      resultMessages[Math.floor(Math.random() * resultMessages.length)]
    );
  }, []);

  const shareMessage =
    shareMessages[Math.floor(Math.random() * shareMessages.length)];

  const { handleKakaoShare } = useKakaoShare();

  const handlerShare = () => {
    handleKakaoShare({
      title: "월드컵 결과",
      description: shareMessage,
      shareUrl: `${window.location.origin}${window.location.pathname}`,
      imageUrl: result.imageUrl,
      resultUrl: `${window.location.origin}${window.location.pathname}?result=${result.id}`,
    });
  };

  useEffect(() => {
    // 축하 효과
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "backOut",
      },
    },
  };
  return (
    <motion.div
      ref={resultRef}
      className="pt-[120px] md:pt-0  w-full min-h-dvh bg-gradient-to-b from-zinc-900 to-zinc-800 flex flex-col items-center justify-center px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-md w-full space-y-8">
        {/* 결과 이미지 */}
        <motion.div
          variants={imageVariants}
          className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl"
        >
          <Image
            src={result.imageUrl}
            alt={result.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </motion.div>

        {/* 결과 텍스트 */}
        <motion.div variants={itemVariants} className="text-center space-y-2">
          <motion.h2 className="text-4xl font-bold text-white">
            {result.name}
          </motion.h2>
          <motion.p className="text-indigo-400 text-lg">
            {randomMessage}
          </motion.p>
        </motion.div>

        {/* 버튼 그룹 */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4">
          <ShareButton handlerShare={handlerShare} />

          <motion.div variants={itemVariants}>
            <Link
              href={`/game/tournamentGame/${gameId}/statistics`}
              className="group relative w-full flex items-center justify-center py-4 px-6 bg-zinc-700 hover:bg-zinc-600 rounded-xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FiBarChart2 className="mr-2" />
              <span>다른 사람들은 뭘 골랐을까?</span>
              <div className="absolute inset-0 rounded-xl border-2 border-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </Link>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Link
              href={`/game/tournamentGame`}
              className="group relative w-full flex items-center justify-center py-4 px-6 bg-zinc-700 hover:bg-zinc-600 rounded-xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span>목록으로 돌아가기</span>
              <div className="absolute inset-0 rounded-xl border-2 border-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </Link>
          </motion.div>
        </motion.div>

        {/* 하단 버튼들 */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-zinc-800"
        >
          <motion.button
            onClick={() => {
              const baseUrl = window.location.href.split("?")[0];
              window.location.href = baseUrl;
            }}
            className="flex-1 group relative inline-flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800/50 hover:bg-zinc-700/50 rounded-xl text-zinc-300 hover:text-white font-medium transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>다시 시작하기</span>
            <div className="absolute inset-0 rounded-xl border border-zinc-700/50 group-hover:border-zinc-500/50 transition-colors duration-300" />
          </motion.button>

          <motion.div
            className="flex-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/game/tournamentGame/create"
              className="group relative w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600/10 hover:bg-indigo-600/20 rounded-xl text-indigo-400 hover:text-indigo-300 font-medium transition-all duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>나도 게임 만들기</span>
              <div className="absolute inset-0 rounded-xl border border-indigo-500/20 group-hover:border-indigo-500/30 transition-colors duration-300" />
            </Link>
          </motion.div>
        </motion.div>

        {/* 추가: 하단 여백 */}
        <div className="h-8" />
      </div>
    </motion.div>
  );
};
