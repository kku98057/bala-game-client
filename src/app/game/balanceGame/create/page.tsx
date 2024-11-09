"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CustomButton from "@/app/_components/buttons/CustomButton";
import CustomLink from "@/app/_components/buttons/CustomLink";
import Section from "@/app/_components/Section";
import TitleText from "@/app/_components/TitleText";
import { QUERYKEYS } from "@/queryKeys";
import { UserProps } from "@/app/types/UserType";
import Cookies from "js-cookie";
import { createBalanceGameData } from "./_lib/createBalanceGameData";
import { BalanceGameProps } from "@/app/types/balanceGameType";
import TitleSection from "@/app/_components/TitleSection";
import { useAuthStore } from "@/app/store";

export default function CreateBalanceGamePage() {
  const LIMIT_TITLE = 20;
  const LIMIT_CHOICE_NAME = 50;
  const [title, setTitle] = useState("");
  const queryClient = useQueryClient();
  const [questions, setQuestions] = useState<
    { title: string; items: { name: string }[] }[]
  >([{ title: "", items: [{ name: "" }, { name: "" }] }]);
  const { user, setUser } = useAuthStore((state) => state);
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: BalanceGameProps) => createBalanceGameData(data),
    mutationKey: QUERYKEYS.balanceGame.create(),
  });

  // 질문 추가
  const addQuestion = () => {
    if (questions.length >= 10) {
      alert("최대 10개까지의 질문만 추가할 수 있습니다.");
      return;
    }
    setQuestions([
      ...questions,
      { title: "", items: [{ name: "" }, { name: "" }] },
    ]);
  };

  // 질문 삭제
  const removeQuestion = (index: number) => {
    if (questions.length === 1) return alert("1개 이하로 줄일 수 없습니다.");
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  // 선택지 추가
  const addItem = (questionIndex: number) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].items.length >= 5) {
      alert("최대 5개까지의 선택지만 추가할 수 있습니다.");
      return;
    }
    newQuestions[questionIndex].items.push({ name: "" });
    setQuestions(newQuestions);
  };

  // 선택지 삭제
  const removeItem = (questionIndex: number, itemIndex: number) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].items.length <= 2) {
      alert("최소 2개의 선택지가 필요합니다.");
      return;
    }
    newQuestions[questionIndex].items = newQuestions[
      questionIndex
    ].items.filter((_, i) => i !== itemIndex);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("로그인이 필요한 서비스입니다.");
      router.push("/login");
      return;
    }

    // 유효성 검사
    if (!title.trim()) {
      alert("게임 제목을 입력해주세요.");
      return;
    }

    if (questions.length === 0) {
      alert("최소 1개 이상의 질문이 필요합니다.");
      return;
    }

    // 각 질문과 선택지 검증
    for (const [index, question] of questions.entries()) {
      if (question.items.length < 2) {
        alert(`${index + 1}번 질문은 최소 2개의 선택지가 필요합니다.`);
        return;
      }

      for (const [itemIndex, item] of question.items.entries()) {
        if (!item.name.trim()) {
          alert(
            `${index + 1}번 질문의 ${
              itemIndex + 1
            }번 선택지 내용을 입력해주세요.`
          );
          return;
        }
      }
    }

    mutate(
      {
        title,
        username: user.nickname,
        questions,
      },
      {
        onSuccess: (response) => {
          alert("밸런스 게임이 생성되었습니다.");
          queryClient.invalidateQueries({
            queryKey: QUERYKEYS.balanceGame.all(),
          });
          router.push(`/game/balanceGame`);
        },
        onError: (error: any) => {
          if (error.response?.status === 401) {
            alert("로그인이 필요한 서비스입니다.");
            router.push("/login");
            return;
          }
          alert(error.response?.data?.message || "게임 생성에 실패했습니다.");
        },
      }
    );
  };

  return (
    <Section>
      <TitleSection title="밸런스 게임" subTitle="생성하기">
        <CustomLink href="/game/balanceGame" icon="arrow" iconPosition="right">
          게임 목록
        </CustomLink>
      </TitleSection>

      <form
        className="flex justify-center pb-24 mt-0 px-0 sm:mt-[150px]"
        onSubmit={handleSubmit}
      >
        <div className="w-full  space-y-6 sm:space-y-8">
          {/* 게임 제목 입력 */}
          <div className="space-y-2">
            <label className="text-base sm:text-lg font-medium text-white">
              게임 제목 (필수)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                if (e.target.value.length > 20) {
                  alert("게임 제목은 20자 이하로 입력해주세요.");
                  return;
                }
                setTitle(e.target.value);
              }}
              placeholder="예)악랄한 밸런스게임 모음"
              className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* 질문 리스트 */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-base sm:text-lg font-medium text-white">
                질문 목록
              </h2>
            </div>

            {questions.map((question, qIndex) => (
              <div
                key={qIndex}
                className="p-4 sm:p-6 bg-zinc-800/50 rounded-xl border border-zinc-700"
              >
                <div className="flex justify-between items-center gap-4 mb-4">
                  <h3 className="text-base sm:text-lg font-medium text-white">
                    질문 {qIndex + 1} (선택)
                  </h3>
                  <button onClick={() => removeQuestion(qIndex)} type="button">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.25 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                {/* 질문 내용 입력 */}
                <div className="mb-4 sm:mb-6">
                  <input
                    type="text"
                    value={question.title}
                    onChange={(e) => {
                      if (e.target.value.length > LIMIT_TITLE)
                        return alert(`${LIMIT_TITLE}자 이하로 입력해주세요.`);
                      const newQuestions = [...questions];
                      newQuestions[qIndex].title = e.target.value;
                      setQuestions(newQuestions);
                    }}
                    placeholder="질문을 입력하세요"
                    className="w-full py-2 sm:py-3 px-3 sm:px-4 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* 선택지 목록 */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center gap-2">
                    <h4 className="text-sm font-medium text-zinc-400">
                      선택지(필수)
                    </h4>
                    <button
                      onClick={() => addItem(qIndex)}
                      className=" text-indigo-400 hover:text-indigo-300 transition-colors"
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  {question.items.map((item, iIndex) => (
                    <div key={iIndex} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => {
                          if (e.target.value.length > LIMIT_CHOICE_NAME)
                            return alert(
                              `${LIMIT_CHOICE_NAME}자 이하로 입력해주세요.`
                            );
                          const newQuestions = [...questions];
                          newQuestions[qIndex].items[iIndex].name =
                            e.target.value;
                          setQuestions(newQuestions);
                        }}
                        placeholder={`선택지 ${iIndex + 1}`}
                        className="flex-1 min-w-0 py-2 sm:py-3 px-3 sm:px-4 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => removeItem(qIndex, iIndex)}
                        type="button"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.25 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 제출 버튼 */}
          <div className="fixed gap-4 flex items-center  justify-center w-11/12 left-1/2 -translate-x-1/2 bottom-8 sm:bottom-8 pt-4 px-4 sm:px-0   z-10">
            <button
              type="submit"
              disabled={isPending}
              className="group flex-1 relative  max-w-xl  flex items-center justify-center py-3 sm:py-4 px-4 sm:px-6 bg-green-600 hover:bg-green-700 rounded-xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isPending ? "생성 중..." : "게임 생성하기"}
              <div className="absolute inset-0 rounded-xl border-2 border-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </button>{" "}
            <CustomButton
              onClick={addQuestion}
              icon="plus"
              className="group flex-1 relative   max-w-xl  flex items-center justify-center !py-3 sm:!py-4 !px-4 sm:!px-6 bg-green-600 hover:bg-green-700 rounded-xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              질문 추가
            </CustomButton>
          </div>
        </div>
      </form>
    </Section>
  );
}
