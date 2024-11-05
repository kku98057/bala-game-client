import { QUERYKEYS } from "@/queryKeys";
import TournamenGameSection from "./_components/TournamenGameSection";
import { getTournamenGameData } from "./_lib/getTournamenGameData";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Script from "next/script";
import { DEFAULT_METADATA } from "@/app/enum";
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
  return {
    title: `${gameData.title} | ${DEFAULT_METADATA.siteName}`,
    description: `여러가지 선택지 중 최애를 골라보자! ${DEFAULT_METADATA.defaultDescription}`,
    openGraph: {
      title: `${gameData.title} | ${DEFAULT_METADATA.siteName}`,
      description: `여러가지 선택지 중 최애를 골라보자! ${DEFAULT_METADATA.defaultDescription}`,
      type: "website",
      url: `https://balansome.co.kr/game/tournamentGame/${gameData.id}`,
      siteName: DEFAULT_METADATA.siteName,
      images: gameData.items[0].imageUrl,
    },
  };
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
    const structuredData = () => {
      return {
        "application-name": DEFAULT_METADATA.siteName,
        // OG 게임 정보를 별도의 태그로 추가
        "og:game:type": "TOURNAMENT",
        "schema:game": JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Game",
          name: `${gameData.title} | ${DEFAULT_METADATA.siteName}`,
          description: `여러가지 선택지 중 최애를 골라보자! ${DEFAULT_METADATA.defaultDescription}`,
          url: `https://balansome.co.kr/game/tournamentGame/${gameData.id}`,
          author: {
            "@type": "Person",
            name: gameData.username,
          },
          datePublished: gameData.createdAt,
          genre: "TOURNAMENT",
        }),
      };
    };
    return (
      <HydrationBoundary state={dehydrateState}>
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="beforeInteractive" // 이 부분 추가
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <TournamenGameSection />
      </HydrationBoundary>
    );
  } catch (error) {
    // 에러 발생시 404
    notFound();
  }
}
