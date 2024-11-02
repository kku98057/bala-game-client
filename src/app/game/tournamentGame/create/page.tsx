"use client";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { createBalanceGame } from "./_lib/createBalanceGameData";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CustomButton from "@/app/_components/buttons/CustomButton";
import CustomLink from "@/app/_components/buttons/CustomLink";
import Section from "@/app/_components/Section";
import TitleText from "@/app/_components/TitleText";
import { QUERYKEYS } from "@/queryKeys";
import { UserProps } from "@/app/types/UserType";
import Cookies from "js-cookie";
export default function CreateTournamentGameGamePage() {
  const [title, setTitle] = useState(""); // 게임 제목 추가

  const [tournamentType, setTournamentType] = useState<4 | 8 | 16 | null>(null);
  const [user, setUser] = useState<UserProps | null>(null);
  const [list, setList] = useState<
    { name: string; image: File | null; id: number }[]
  >([]);

  const router = useRouter();
  const mutation = useMutation({
    mutationFn: createBalanceGame,
    mutationKey: QUERYKEYS.tournamentGame.create(),
  });
  const initializeTournament = (type: 4 | 8 | 16) => {
    const itemCount = type * 2;
    setTournamentType(type);
    setList(
      Array(itemCount)
        .fill(null)
        .map((_, i) => ({
          name: "",
          image: null,
          id: i + 1,
        }))
    );
  };
  const handleBulkImageUpload = useCallback(
    (files: FileList) => {
      if (files.length > list.length) {
        alert(`선택 가능한 이미지는 최대 ${list.length}개입니다.`);
        return;
      }

      const newList = [...list];
      let availableSlotIndex = 0;

      // 비어있는 첫 번째 슬롯 찾기
      while (
        availableSlotIndex < list.length &&
        newList[availableSlotIndex].image !== null
      ) {
        availableSlotIndex++;
      }

      Array.from(files).forEach((file, index) => {
        if (!file.type.startsWith("image/")) {
          alert(`${file.name}은(는) 이미지 파일이 아닙니다.`);
          return;
        }

        // 현재 사용 가능한 슬롯이 있고, 전체 길이를 초과하지 않는 경우에만 추가
        if (availableSlotIndex + index < list.length) {
          newList[availableSlotIndex + index].image = file;
        }
      });

      setList(newList);

      const totalUploaded = newList.filter((item) => item.image).length;
      const remainingSlots = list.length - totalUploaded;

      // 업로드 완료 메시지
      if (remainingSlots > 0) {
        alert(
          `${files.length}개의 이미지가 업로드되었습니다. 남은 선택지: ${remainingSlots}개`
        );
      } else {
        alert(
          `모든 이미지가 업로드되었습니다. (${list.length}/${list.length})`
        );
      }
    },
    [list]
  );
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 유효성 검사
    if (!user) {
      alert("로그인이 필요한 서비스입니다.");
      router.push("/login");
      return;
    }
    if (list.length % 2 !== 0) {
      alert("선택지는 짝수 개수로만 생성할 수 있습니다.");
      return;
    }
    // 유효성 검사
    if (!title.trim()) {
      alert("게임 제목을 입력해주세요.");
      return;
    }
    if (title.length > 20) {
      alert("게임 제목은 20자 이하로 입력해주세요.");
      return;
    }
    if (![8, 16, 32].includes(list.length)) {
      alert("8강, 16강, 32강 중 하나의 형식으로만 생성할 수 있습니다.");
      return;
    }
    // 선택지 이름 길이 검증 추가
    const invalidItem = list.find((item) => item.name.trim().length > 20);
    if (invalidItem) {
      alert("선택지 설명은 20자 이하로 입력해주세요.");
      return;
    }

    // 모든 항목이 이름과 이미지를 가지고 있는지 확인
    const isValid = list.every((item) => item.name.trim() && item.image);
    if (!isValid) {
      alert("모든 선택지의 이름과 이미지를 입력해주세요.");
      return;
    }

    // FormData 생성
    const formData = new FormData();

    // 기본 데이터 추가
    formData.append("title", title);
    formData.append("username", user.nickname);

    // 각 아이템의 이름을 별도로 추가
    list.forEach((item, index) => {
      if (item.image) {
        formData.append("image", item.image);
        formData.append(`list[${index}][name]`, item.name); // 각 아이템의 이름을 개별적으로 추가
      }
    });

    // mutation 실행
    mutation.mutate(formData, {
      onSuccess: (response) => {
        alert("생성이 완료되었습니다.");
        router.push(`/tournamentGame/${response.data.id}`);
      },
      onError: (error: any) => {
        if (error.response?.status === 401) {
          alert("로그인이 필요한 서비스입니다.");
          router.push("/login");
          return;
        }

        // 그 외 에러 메시지 표시
        const errorMessage =
          error.response?.data?.message ||
          "게임 생성에 실패했습니다. 다시 시도해주세요.";
        alert(errorMessage);
      },
    });
  };
  const [draggingStates, setDraggingStates] = useState<boolean[]>(
    new Array(list.length).fill(false)
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      e.stopPropagation();

      // 해당 인덱스의 드래그 상태만 false로 변경
      setDraggingStates((prev) => {
        const newStates = [...prev];
        newStates[index] = false;
        return newStates;
      });

      const files = e.dataTransfer.files;
      if (files?.[0]) {
        const file = files[0];
        if (file.type.startsWith("image/")) {
          const newList = [...list];
          newList[index].image = file;
          setList(newList);
        } else {
          alert("이미지 파일만 업로드 가능합니다.");
        }
      }
    },
    [list]
  );
  // 드래그 이벤트 핸들러 수정
  const handleDragEnter = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();

    // 해당 인덱스의 드래그 상태만 true로 변경
    setDraggingStates((prev) => {
      const newStates = [...prev];
      newStates[index] = true;
      return newStates;
    });
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();

    // 해당 인덱스의 드래그 상태만 false로 변경
    setDraggingStates((prev) => {
      const newStates = [...prev];
      newStates[index] = false;
      return newStates;
    });
  }, []);
  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      setUser(JSON.parse(userCookie));
    } else {
      // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
      router.push("/login");
    }
  }, [router]);
  return (
    <Section>
      {/* 고정된 헤더 */}
      <div className="flex flex-col items-center justify-between mb-24 sm:flex-row sm:items-end">
        <TitleText>토너먼트 게임 생성하기</TitleText>
        <CustomLink
          href="/game/tournamentGame/create"
          icon="arrow"
          iconPosition="right"
        >
          <span className="flex items-center gap-2">게임 목록으로</span>
        </CustomLink>
      </div>

      <form
        className="flex justify-center  pb-8 mt-[150px]"
        onSubmit={handleSubmit}
      >
        <div className=" w-full space-y-8">
          {/* 게임 제목 입력 */}
          <div className="space-y-2">
            <label className="text-lg font-medium text-white">게임 제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                if (e.target.value.length > 20)
                  return alert("게임 제목은 최대 20자까지 입니다.");
                setTitle(e.target.value);
              }}
              placeholder="예) 당신의 선택은?"
              className="w-full py-4 px-6 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          {/* <div className="space-y-2">
            <label className="text-lg font-medium text-white">작성자</label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                if (e.target.value.length > 8)
                  return alert("작성자명은 최대 8자까지 입니다.");
                setUsername(e.target.value);
              }}
              placeholder="작성자명을 입력하세요."
              className="w-full py-4 px-6 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div> */}
          {!tournamentType && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-white">
                토너먼트 형식 선택
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => initializeTournament(4)}
                  className="group relative py-4 px-6 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-semibold transition-all duration-200"
                >
                  4강 (8개 선택지)
                </button>
                <button
                  type="button"
                  onClick={() => initializeTournament(8)}
                  className="group relative py-4 px-6 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-semibold transition-all duration-200"
                >
                  8강 (16개 선택지)
                </button>
                <button
                  type="button"
                  onClick={() => initializeTournament(16)}
                  className="group relative py-4 px-6 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-semibold transition-all duration-200"
                >
                  16강 (32개 선택지)
                </button>
              </div>
            </div>
          )}
          {tournamentType && (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-white">
                  {tournamentType}강 토너먼트 ({list.length}개 선택지)
                </h2>
                <div className="flex items-center gap-4 justify-center">
                  <CustomButton icon="plus">
                    <label className="cursor-pointer text-white ">
                      <span>이미지 일괄 업로드</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files) {
                            handleBulkImageUpload(e.target.files);
                          }
                        }}
                      />
                    </label>
                  </CustomButton>
                  <CustomButton
                    onClick={() => {
                      const isValidChange = list.some(
                        (item) => item.name.trim() || item.image
                      );
                      if (isValidChange) {
                        const result = window.confirm(
                          "형식 변경 시 선택지는 초기화 됩니다. 진행하시겠습니까?"
                        );
                        if (result) {
                          setTournamentType(null);
                          setList([]);
                        }
                      } else {
                        setTournamentType(null);
                        setList([]);
                      }
                    }}
                    className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
                  >
                    형식 변경
                  </CustomButton>
                </div>
              </div>
            </>
          )}

          {/* 항목 리스트 */}
          <ul className=" w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {list.map((item, index) => (
              <li
                key={index}
                className="relative p-6 bg-zinc-800/50 rounded-xl border border-zinc-700 hover:border-zinc-600 transition-all duration-200"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="text-lg font-medium text-white">
                    선택지 {index + 1}
                  </div>
                </div>

                {/* 이미지 업로드 영역 */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm text-zinc-400">
                    이미지
                  </label>
                  <div className="relative">
                    {item.image ? (
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden group">
                        <Image
                          src={URL.createObjectURL(item.image)}
                          alt={item.name}
                          fill
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newList = [...list];
                            newList[index].image = null;
                            setList(newList);
                          }}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200"
                        >
                          이미지 변경
                        </button>
                      </div>
                    ) : (
                      <label
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnter={(e) => handleDragEnter(e, index)}
                        onDragLeave={(e) => handleDragLeave(e, index)}
                        className={`flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200
                        ${
                          draggingStates[index]
                            ? "border-indigo-500 bg-indigo-500/10"
                            : "border-zinc-600 hover:border-indigo-500"
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
                          <svg
                            className="w-8 h-8 mb-4 text-zinc-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-zinc-500">
                            <span className="font-semibold">
                              클릭하거나 드래그하여 업로드
                            </span>
                          </p>
                          <p className="text-xs text-zinc-500">
                            PNG, JPG (최대 10MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const newList = [...list];
                            if (e.target.files) {
                              newList[index].image = e.target.files[0];
                              setList(newList);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* 이름 입력 */}
                <div>
                  <label className="block mb-2 text-sm text-zinc-400">
                    설명
                  </label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => {
                      if (e.target.value.length > 20)
                        return alert("설명은 최대 20자까지 입니다.");
                      const newList = [...list];
                      newList[index].name = e.target.value;
                      setList(newList);
                    }}
                    placeholder="예) 치킨, 피자"
                    className="w-full py-3 px-4 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </li>
            ))}
          </ul>

          {/* 하단 버튼 */}
          <div className="sticky bottom-8 pt-4 space-y-4 bg-gradient-to-t from-zinc-800 to-zinc-800/95">
            {tournamentType && (
              <button
                type="submit"
                disabled={mutation.isPending}
                className="group relative w-full flex items-center justify-center py-4 px-6 bg-green-600 hover:bg-green-700 rounded-xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {mutation.isPending ? "생성 중..." : "게임 생성하기"}
                <div className="absolute inset-0 rounded-xl border-2 border-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </button>
            )}
          </div>
        </div>
      </form>
    </Section>
  );
}
