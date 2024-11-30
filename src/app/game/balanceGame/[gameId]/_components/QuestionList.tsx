"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // framer-motion 추가
import Link from "next/link";
import { useParams } from "next/navigation";
import { FiBarChart2 } from "react-icons/fi";

export interface BalanceQuestion {
  id: number;
  title: string;
  items: {
    id: number;
    name: string;
    selectCount: number;
  }[];
  totalParticipants: number;
}

interface QuestionListProps {
  questions: BalanceQuestion[];
}

export default function QuestionList({ questions }: QuestionListProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const gameId = useParams().gameId;
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [results, setResults] = useState<Record<number, any>>({});

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleSelect = async (questionId: number, itemId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/balanceGame/choice`,
        {
          method: "POST",
          credentials: "include",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            questionId,
            selectedItemId: itemId,
          }),
        }
      );

      if (!response.ok) throw new Error("선택 저장에 실패했습니다.");

      const data = await response.json();

      setSelectedAnswers((prev) => ({
        ...prev,
        [questionId]: itemId,
      }));

      setResults((prev) => ({
        ...prev,
        [questionId]: data.data,
      }));
    } catch (error) {
      console.error("선택 저장 실패:", error);
    }
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };
  const completeMessages = [
    "🎉 축하합니다! 당신만의 선택을 완료했어요!",
    "🌟 멋진 선택이었어요! 다른 사람들의 선택이 궁금하지 않나요?",
    "🎯 센스 있는 선택! 이제 전체 통계를 확인해보세요!",
    "✨ 당신의 선택이 궁금했어요! 결과를 확인해볼까요?",
    "🏆 모든 선택 완료! 당신의 선택은 얼마나 특별할까요?",
  ];

  // 랜덤 메시지 상태 추가
  const [completeMessage, setCompleteMessage] = useState("");

  // 마지막 질문 도달시 랜덤 메시지 설정
  useEffect(() => {
    if (isLastQuestion && results[currentQuestion.id]) {
      const randomIndex = Math.floor(Math.random() * completeMessages.length);
      setCompleteMessage(completeMessages[randomIndex]);
    }
  }, [isLastQuestion, results, currentQuestion.id]);
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* 진행 상황 표시 */}
      <div className="mb-6 flex flex-col items-center gap-2">
        {isLastQuestion && results[currentQuestion.id] ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-indigo-500/10 rounded-full px-6 py-2 border border-indigo-500/20"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <span className="text-indigo-400">모든 질문 완료!</span>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.4,
                  type: "spring",
                  stiffness: 200,
                }}
                className="w-2 h-2 rounded-full bg-indigo-400"
              />
            </motion.div>
          </motion.div>
        ) : (
          <>
            <div className="flex justify-center gap-2">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentQuestionIndex
                      ? "bg-indigo-500 scale-125"
                      : index < currentQuestionIndex
                      ? "bg-indigo-300"
                      : "bg-zinc-600"
                  }`}
                />
              ))}
            </div>
            <p className="text-zinc-400 text-sm">
              {currentQuestionIndex + 1} / {questions.length}
            </p>
          </>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="bg-zinc-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-zinc-700/50"
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            {currentQuestion.title}
          </h3>
          <div className="grid grid-cols-2 gap-6">
            {currentQuestion.items.map((item) => {
              const result = results[currentQuestion.id]?.results?.find(
                (r: any) => r.id === item.id
              );

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(currentQuestion.id, item.id)}
                  disabled={!!selectedAnswers[currentQuestion.id]}
                  className={`
                  relative p-6 rounded-xl transition-all duration-300
                  ${
                    selectedAnswers[currentQuestion.id]
                      ? selectedAnswers[currentQuestion.id] === item.id
                        ? "bg-indigo-600 ring-2 ring-indigo-400 ring-offset-2 ring-offset-zinc-800 text-white"
                        : "bg-zinc-700/50 text-zinc-400"
                      : "bg-zinc-700/50 hover:bg-zinc-600/50 hover:scale-105 text-white"
                  }
                `}
                >
                  <span className="text-xl font-medium block">{item.name}</span>
                  {result && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 space-y-1"
                    >
                      <div className="w-full bg-zinc-800/50 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${result.percentage}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-indigo-400"
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{result.selectCount}명</span>
                        <span>{result.percentage}%</span>
                      </div>
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>

          {results[currentQuestion.id] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 text-center"
            >
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-zinc-400 mb-4"
              >
                총{" "}
                <span className="text-indigo-400 font-medium">
                  {results[currentQuestion.id].totalParticipants}
                </span>
                명 참여
              </motion.p>
              {isLastQuestion ? (
                <div className="space-y-6">
                  <motion.p
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-2xl font-bold text-white"
                  >
                    {completeMessage}
                  </motion.p>
                  <motion.div
                    className="flex flex-col gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Link
                      href={`/game/balanceGame/${gameId}/statistics`}
                      className="group relative px-6 py-4 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/20"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <motion.div
                          initial={{ rotate: -180, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          transition={{
                            delay: 0.4,
                            type: "spring",
                            stiffness: 200,
                          }}
                        >
                          <FiBarChart2 className="text-xl" />
                        </motion.div>
                        <span className="text-lg font-medium">
                          다른 사람들의 선택 보기
                        </span>
                      </div>
                      <div className="absolute inset-0 rounded-xl border-2 border-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </Link>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Link
                        href="/game/balanceGame"
                        className="block px-6 py-4 bg-zinc-700/50 hover:bg-zinc-600/50 rounded-xl text-white transition-all duration-300 hover:shadow-lg"
                      >
                        목록으로 돌아가기
                      </Link>
                    </motion.div>
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      onClick={() => window.location.reload()}
                      className="text-zinc-400 hover:text-white transition-colors duration-200 hover:scale-105 transform"
                    >
                      다시 시작하기
                    </motion.button>
                  </motion.div>
                </div>
              ) : (
                <motion.button
                  onClick={handleNext}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-6 py-4 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white transition-colors duration-300"
                >
                  <span className="text-lg font-medium">다음 질문으로</span>
                  <div className="absolute inset-0 rounded-xl border-2 border-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </motion.button>
              )}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
