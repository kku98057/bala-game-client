import { GameTypeProps } from "@/app/types/types";
import CustomLink from "../buttons/CustomLink";
import Section from "../Section";
import TitleText from "../TitleText";
import { useParams } from "next/navigation";
import Comments from "../comment/Comments";
import { useState } from "react";
import { FaChartBar, FaComments } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  title: string;
  gameType: GameTypeProps;
  username: string;
  createdAt: string;
  count: number;
};
export default function StatisticsSection({
  children,
  title,
  gameType,
  username,
  createdAt,
  count,
}: Props) {
  const gameId = useParams().gameId;
  const [showComments, setShowComments] = useState(false);
  return (
    <Section>
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-2 md:gap-4 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-4 md:gap-6 w-full sm:w-auto">
          <TitleText>{title}</TitleText>
          <button
            onClick={() => setShowComments(!showComments)}
            className={`
              flex items-center gap-3 px-4 sm:px-4 md:px-6 py-2 sm:py-2 md:py-3 rounded-xl
              text-base sm:text-base md:text-lg font-semibold w-full sm:w-auto justify-center
              transition-all duration-300 transform hover:scale-105
              ${
                showComments
                  ? "bg-indigo-600 text-white ring-2 ring-indigo-400"
                  : "bg-zinc-800 hover:bg-zinc-700 text-white"
              }
            `}
          >
            <FaComments size={20} />
            <span>댓글</span>
          </button>
        </div>

        <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-2 md:gap-4 w-full sm:w-auto">
          <CustomLink
            icon="arrow"
            href={`/game/${
              gameType === "BALANCE" ? "balanceGame" : "tournamentGame"
            }/${gameId}`}
            iconPosition="right"
            className="flex-1 sm:flex-none text-sm sm:text-sm md:text-base"
          >
            다시하기
          </CustomLink>
          <CustomLink
            icon="arrow"
            href={`/game/${
              gameType === "BALANCE" ? "balanceGame" : "tournamentGame"
            }`}
            iconPosition="right"
            className="flex-1 sm:flex-none text-sm sm:text-sm md:text-base"
          >
            게임목록
          </CustomLink>
        </div>
      </div>

      <div className="relative min-h-[calc(100vh-200px)]">
        <div
          className={`w-full transition-all duration-300 ${
            showComments ? "lg:mr-[400px]" : ""
          }`}
        >
          <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 md:p-8 mb-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 md:gap-6">
                <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 sm:gap-2 md:gap-4">
                  <div className="bg-indigo-500/10 px-3 sm:px-3 md:px-4 py-2 rounded-lg">
                    <span className="text-zinc-400 text-sm md:text-base">
                      작성자
                    </span>
                    <span className="ml-2 text-base sm:text-base md:text-lg font-bold text-white">
                      {username}
                    </span>
                  </div>
                  <div className="bg-indigo-500/10 px-3 sm:px-3 md:px-4 py-2 rounded-lg">
                    <span className="text-zinc-400 text-sm md:text-base">
                      작성일
                    </span>
                    <span className="ml-2 text-sm md:text-base text-white">
                      {new Date(createdAt).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <div className="bg-indigo-500/10 px-3 sm:px-3 md:px-4 py-2 rounded-lg sm:ml-auto w-full sm:w-auto text-center">
                  <span className="text-zinc-400 text-sm md:text-base">
                    총 질문
                  </span>
                  <span className="ml-2 text-base sm:text-base md:text-lg font-bold text-indigo-400">
                    {count}개
                  </span>
                </div>
              </div>
            </div>
          </div>
          {children}
        </div>

        <AnimatePresence>
          {showComments && (
            <>
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 w-full md:w-[400px] h-full bg-zinc-900/95 backdrop-blur-sm shadow-xl z-40 overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">댓글</h2>
                    <button
                      onClick={() => setShowComments(false)}
                      className="text-zinc-400 hover:text-white p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                      닫기
                    </button>
                  </div>
                  <Comments gameId={Number(gameId)} gameType={gameType} />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowComments(false)}
                className="fixed inset-0 bg-black/50 z-30 md:hidden"
              />
            </>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}
