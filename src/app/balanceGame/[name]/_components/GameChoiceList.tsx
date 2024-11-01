import { GameProps } from "@/app/types/gameType";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";

interface GameChoiceListProps {
  list: GameProps;
  onSelect: (list1: GameProps, list2: GameProps, selected: GameProps) => void;
  curGame: GameProps[];
  isSelecting: boolean;
}

export const GameChoiceList = ({
  list,
  onSelect,
  curGame,
  isSelecting,
}: GameChoiceListProps) => {
  const itemRef = useRef<HTMLDivElement>(null);

  const handleSelect = async () => {
    if (isSelecting) return;

    // 클릭 효과 애니메이션
    const tl = gsap.timeline();

    // 선택된 항목 효과
    tl.to(itemRef.current, {
      scale: 1.05,
      duration: 0.2,
      ease: "power2.out",
    }).to(itemRef.current, {
      scale: 1,
      duration: 0.15,
    });

    // 선택되지 않은 항목 페이드 아웃
    const otherChoice = document.querySelector(
      `.game-choice:not([data-id="${list.id}"])`
    );

    tl.to(
      otherChoice,
      {
        opacity: 0.3,
        scale: 0.95,
        duration: 0.3,
        ease: "power2.out",
      },
      "-=0.3"
    );

    // 선택 핸들러 호출
    onSelect(curGame[0], curGame[1], list);
  };

  return (
    <div
      ref={itemRef}
      onClick={handleSelect}
      data-id={list.id}
      className={`game-choice w-full h-full cursor-pointer relative transition-all
        ${isSelecting ? "pointer-events-none" : ""}
      `}
    >
      {/* 로딩 인디케이터 */}
      {isSelecting && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <div className="w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* 기존 컨텐츠 */}
      <div className="relative w-full h-full group">
        <Image
          src={list.imageUrl}
          alt={list.name}
          className=" object-cover hover:brightness-75 hover:scale-105 transition-all duration-300"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
        <p className="absolute bottom-[15%] left-[50%] translate-x-[-50%] text-white text-[5cqi] font-bold">
          {list.name}
        </p>
      </div>
    </div>
  );
};
