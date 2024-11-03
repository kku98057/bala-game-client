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
    <motion.button
      onClick={handleSelect}
      disabled={isSelecting || disabled}
      className="w-full block  h-[50dvh] md:h-[100dvh] relative overflow-hidden"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      data-id={list.id}
    >
      <motion.div
        className="relative w-full h-full group overflow-hidden "
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={list.imageUrl}
          alt={list.name}
          className="block object-cover transition-all duration-300"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />

        <motion.div
          className="absolute inset-0 bg-black/30"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />

        <p className="absolute bottom-[15%] left-[50%] translate-x-[-50%] text-white text-[10cqi] md:text-[5cqi] font-bold">
          {list.name}
        </p>
      </motion.div>

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
  );
};
