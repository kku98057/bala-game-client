import { GameProps } from "@/app/types/gameType";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";
import { motion } from "framer-motion";
interface GameChoiceListProps {
  list: GameProps;
  onSelect: (list1: GameProps, list2: GameProps, selected: GameProps) => void;
  curGame: GameProps[];
  isSelecting: boolean;
  disabled?: boolean;
}

export const GameChoiceList = ({
  list,
  onSelect,
  curGame,
  isSelecting,
  disabled,
}: GameChoiceListProps) => {
  const itemRef = useRef<HTMLButtonElement>(null);

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
    <div className="relative flex flex-col h-[calc(50dvh-50px)] md:h-[calc(100dvh-100px)]">
      {/* 상단 광고 공간 */}
      {/* <div className="h-[50px] md:h-[100px] bg-zinc-900 flex items-center justify-center">
        <div className="text-zinc-600 text-sm">광고 영역</div>
      </div> */}

      {/* 게임 선택 버튼 */}
      <motion.button
        ref={itemRef}
        onClick={handleSelect}
        disabled={isSelecting || disabled}
        className="flex-1 relative overflow-hidden game-choice"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        data-id={list.id}
      >
        <motion.div
          className="relative w-full h-full group"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          {/* 이미지 컨테이너 */}
          <div className="absolute inset-0 bg-zinc-900">
            <Image
              src={list.imageUrl}
              alt={list.name}
              fill
              className="object-cover 
                object-center 
                md:object-[center_20%]
                lg:object-[center_15%]"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              quality={85}
            />
          </div>

          {/* 배경 그라데이션 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

          {/* 호버 오버레이 */}
          <motion.div
            className="absolute inset-0 bg-black/30"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />

          {/* 텍스트 컨테이너 */}
          <div className="absolute inset-x-0 bottom-0 p-4 md:p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <p className="text-white text-[8cqi] md:text-[5cqi] font-bold text-center leading-tight drop-shadow-lg">
              {list.name}
            </p>
          </div>
        </motion.div>

        {/* 로딩 오버레이 */}
        {isSelecting && (
          <motion.div
            className="absolute inset-0 bg-black/50 flex items-center justify-center z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
      </motion.button>
    </div>
  );
};
