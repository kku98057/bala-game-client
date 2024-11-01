import { GameProps } from "@/app/types/gameType";
import { useCallback, useEffect, useState } from "react";

export const useBalanceGame = (initialData: GameProps[]) => {
  const [isSelecting, setIsSelecting] = useState(false);

  const [curGame, setCurGame] = useState<GameProps[]>([]);
  const [nextGame, setNextGame] = useState<GameProps[]>([]);
  const [result, setResult] = useState<GameProps | null>(null);

  const shuffleArray = useCallback(
    (array: GameProps[]) => array.sort(() => Math.random() - 0.5),
    []
  );

  const selectHandler = useCallback(
    async (list1: GameProps, list2: GameProps, selectedGame: GameProps) => {
      if (isSelecting) return; // 중복 클릭 방지

      setIsSelecting(true);
      if (curGame.length <= 1) return;

      setNextGame((prev) => [...prev, selectedGame]);
      setCurGame((prev) =>
        prev.filter((item) => item.id !== list1.id && item.id !== list2.id)
      );
      setIsSelecting(false);
    },

    [curGame]
  );

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setCurGame(shuffleArray([...initialData]));
    }
  }, [initialData]);
  useEffect(() => {
    if (curGame.length === 0 && nextGame.length > 0) {
      setCurGame(shuffleArray([...nextGame]));
      setNextGame([]);
    } else if (curGame.length === 1 && nextGame.length === 1) {
      setCurGame([...nextGame, ...curGame]);
      setNextGame([]);
    } else if (curGame.length === 1 && nextGame.length === 3) {
      setCurGame(shuffleArray([...nextGame]));
      setNextGame([]);
    } else if (curGame.length === 1 && nextGame.length === 0) {
      setResult(curGame[0]);
      setCurGame([]);
      setNextGame([]);
    }
  }, [curGame, nextGame]);

  return {
    curGame,
    result,
    selectHandler,
    isSelecting,
  };
};
