import { postFinalChoiceData } from "@/app/balanceGame/[gameId]/_lib/postFinalChoiceData";
import { GameProps } from "@/app/types/gameType";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

export const useBalanceGame = (
  initialData: GameProps[],
  gameId: string | string[]
) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [currentRound, setCurrentRound] = useState<string>("");
  const [curGame, setCurGame] = useState<GameProps[]>([]);
  const [nextGame, setNextGame] = useState<GameProps[]>([]);
  const [result, setResult] = useState<GameProps | null>(null);

  const shuffleArray = useCallback(
    (array: GameProps[]) => array.sort(() => Math.random() - 0.5),
    []
  );

  // 라운드 계산 함수 수정
  const calculateRound = useCallback((games: GameProps[]) => {
    const totalGames = games.length;
    if (totalGames === 32) return "32강";
    if (totalGames === 16) return "16강";
    if (totalGames === 8) return "8강";
    if (totalGames === 4) return "4강";
    if (totalGames === 2) return "결승";
    return "";
  }, []);

  const { mutate: finalChoiceHandler } = useMutation({
    mutationFn: (data: { balanceGameId: number; selectedItemId: number }) =>
      postFinalChoiceData(data),
    onSuccess: () => {
      setResult(curGame[0]);
      setCurGame([]);
      setNextGame([]);
    },
  });

  const selectHandler = useCallback(
    async (list1: GameProps, list2: GameProps, selectedGame: GameProps) => {
      if (isSelecting) return;
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

  // 초기 데이터 설정
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      const shuffledGames = shuffleArray([...initialData]);
      setCurGame(shuffledGames);
      setCurrentRound(calculateRound(shuffledGames));
    }
  }, [initialData, shuffleArray, calculateRound]);

  // 게임 진행 로직
  useEffect(() => {
    if (curGame.length === 0 && nextGame.length > 0) {
      // 현재 라운드가 끝나고 다음 라운드로 진행
      const nextRoundGames = shuffleArray([...nextGame]);
      setCurGame(nextRoundGames);
      setNextGame([]);
      setCurrentRound(calculateRound(nextRoundGames));
    } else if (curGame.length === 1 && nextGame.length === 0) {
      // 최종 우승자 결정

      finalChoiceHandler({
        balanceGameId: Number(gameId),
        selectedItemId: curGame[0].id,
      });
    }
  }, [curGame, nextGame, shuffleArray, calculateRound]);

  return {
    curGame,
    result,
    selectHandler,
    isSelecting,
    currentRound,
  };
};
