"use client";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { createBalanceGame } from "./_lib/createBalanceGameData";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CreateBalanceGamePage() {
  const [title, setTitle] = useState(""); // 게임 제목 추가

  const [list, setList] = useState<
    { name: string; image: File | null; id: number }[]
  >(
    Array(8)
      .fill(null)
      .map((_, i) => ({
        name: "",
        image: null, // 초기값을 null로 설정
        id: i + 1,
      }))
  );
  const addItems = () => {
    if (list.length < 20) {
      setList((prev) => [
        ...prev,
        { name: "", image: null, id: prev.length + 1 },
        { name: "", image: null, id: prev.length + 2 },
      ]);
    }
  };
  const removeItem = (indexToRemove: number) => {
    console.log(indexToRemove);
    if (list.length > 8) {
      // 최소 8개 항목 유지
      setList((prev) => prev.filter((_, index) => index !== indexToRemove));
    }
  };
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: createBalanceGame,
    onSuccess: () => {
      // 성공 시 게임 상세 페이지로 이동
      alert("생성이 완료되었습니다.");
      //   router.push(`/balanceGame/${data.id}`);
    },
    onError: (error) => {
      console.error("Error creating game:", error);
      alert("게임 생성에 실패했습니다. 다시 시도해주세요.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 유효성 검사

    // 유효성 검사
    if (!title.trim()) {
      alert("게임 제목을 입력해주세요.");
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
    formData.append("username", "test");

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
        router.push(`/balanceGame/${response.data.id}`);
      },
      onError: (error) => {
        console.error("Error creating game:", error);
        alert("게임 생성에 실패했습니다. 다시 시도해주세요.");
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

  return (
    <div className="w-full min-h-dvh bg-gradient-to-b from-zinc-900 to-zinc-800">
      {/* 고정된 헤더 */}
      <div className="sticky top-[70px] w-full bg-gradient-to-b from-zinc-900 to-zinc-900/95 pt-8 pb-4 px-4 z-10">
        <h1 className="text-4xl font-bold text-center text-white">
          밸런스 게임 생성하기
        </h1>
      </div>

      <form
        className="flex justify-center px-4 pb-8 mt-[150px]"
        onSubmit={handleSubmit}
      >
        <div className="max-w-md w-full space-y-8">
          {/* 게임 제목 입력 */}
          <div className="space-y-2">
            <label className="text-lg font-medium text-white">게임 제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예) 당신의 선택은?"
              className="w-full py-4 px-6 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* 항목 리스트 */}
          <div className="space-y-6">
            {list.map((item, index) => (
              <div
                key={index}
                className="relative p-6 bg-zinc-800/50 rounded-xl border border-zinc-700 hover:border-zinc-600 transition-all duration-200"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="text-lg font-medium text-white">
                    선택지 {index + 1}
                  </div>
                  {list.length > 8 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-400 hover:text-red-300 text-sm transition-colors duration-200"
                    >
                      제거
                    </button>
                  )}
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
                      const newList = [...list];
                      newList[index].name = e.target.value;
                      setList(newList);
                    }}
                    placeholder="예) 치킨, 피자"
                    className="w-full py-3 px-4 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* 하단 버튼 */}
          <div className="sticky bottom-8 pt-4 space-y-4 bg-gradient-to-t from-zinc-800 to-zinc-800/95">
            <button
              type="button"
              onClick={addItems}
              disabled={list.length >= 20}
              className={`group relative w-full flex items-center justify-center py-4 px-6 rounded-xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl ${
                list.length >= 20
                  ? "bg-zinc-700 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              <span>선택지 추가하기 ({list.length}/20)</span>
              <div className="absolute inset-0 rounded-xl border-2 border-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </button>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="group relative w-full flex items-center justify-center py-4 px-6 bg-green-600 hover:bg-green-700 rounded-xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {mutation.isPending ? "생성 중..." : "게임 생성하기"}
              <div className="absolute inset-0 rounded-xl border-2 border-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
