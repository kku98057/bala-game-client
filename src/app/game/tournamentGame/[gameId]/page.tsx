import { QUERYKEYS } from "@/queryKeys";
import TournamenGameSection from "./_components/TournamenGameSection";
import { getTournamenGameData } from "./_lib/getTournamenGameData";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import { generateGameMetadata } from "@/app/_components/metadata/GameMetadatas";
// 동적 메타데이터 생성
// Next.js의 메타데이터 생성 함수
interface Props {
  params: {
    gameId: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // API나 데이터베이스에서 게임 데이터를 가져옵니다
  const NumberId = Number((await params).gameId);
  const gameData = await getTournamenGameData(NumberId);

  // 메타데이터 생성
  return generateGameMetadata({
    gameData,
    gameType: "TOURNAMENT",
  });
}

export default async function page({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const queryClient = new QueryClient();

  try {
    const NumberId = Number((await params).gameId);
    const gameData = await getTournamenGameData(NumberId);

    // 데이터가 없는 경우 404
    if (!gameData) {
      notFound();
    }

    await queryClient.prefetchQuery({
      queryKey: QUERYKEYS.tournamentGame.list(NumberId),
      queryFn: () => Promise.resolve(gameData),
    });

    const dehydrateState = dehydrate(queryClient);

    return (
      <HydrationBoundary state={dehydrateState}>
        <TournamenGameSection />
      </HydrationBoundary>
    );
  } catch (error) {
    // 에러 발생시 404
    notFound();
  }
}
