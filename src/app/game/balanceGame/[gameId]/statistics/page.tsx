import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import BalaceStatisticSection from "./_components/BalaceStatisticSection";
import { QUERYKEYS } from "@/queryKeys";
import { getBalaceGameStatisticsData } from "./_lib/getBalaceGameStatisticsData";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { generateGameMetadata } from "@/app/_components/metadata/GameMetadatas";
import Script from "next/script";
import { DEFAULT_METADATA } from "@/app/enum";
interface Props {
  params: {
    gameId: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // API나 데이터베이스에서 게임 데이터를 가져옵니다
  const NumberId = Number((await params).gameId);
  const gameData = await getBalaceGameStatisticsData(NumberId);

  // 메타데이터 생성
  return {
    title: `${gameData.title}의 통계는? | ${DEFAULT_METADATA.siteName}`,
    description: `여러가지 선택지 중 최선을 골라보자! ${DEFAULT_METADATA.defaultDescription}`,
    openGraph: {
      title: `${gameData.title} | ${DEFAULT_METADATA.siteName}`,
      description: `여러가지 선택지 중 최선을 골라보자! ${DEFAULT_METADATA.defaultDescription}`,
      type: "website",
      url: `https://balansome.co.kr/game/balanceGame/${gameData.id}`,
      siteName: DEFAULT_METADATA.siteName,
      images: DEFAULT_METADATA.defaultThumbnail,
    },
  };
}
export default async function BalanceGameStatisticsPage({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const queryClient = new QueryClient();

  try {
    const NumberId = Number((await params).gameId);

    const gameData = await getBalaceGameStatisticsData(NumberId);

    if (!gameData) {
      notFound();
    }

    await queryClient.prefetchQuery({
      queryKey: QUERYKEYS.balanceGame.statistics(NumberId),
      queryFn: () => Promise.resolve(gameData),
    });

    const dehydrateState = dehydrate(queryClient);
    const structuredData = () => {
      return {
        "application-name": DEFAULT_METADATA.siteName,
        // OG 게임 정보를 별도의 태그로 추가
        "og:game:type": "BALANCE",
        "schema:game": JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Game",
          name: `${gameData.title}의 통계는? | ${DEFAULT_METADATA.siteName}`,
          description: `여러가지 선택지 중 최선을 골라보자! ${DEFAULT_METADATA.defaultDescription}`,
          url: `https://balansome.co.kr/game/balanceGame/${gameData.id}`,
          author: {
            "@type": "Person",
            name: gameData.username,
          },
          datePublished: gameData.createdAt,
          genre: "BALANCE",
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
        <BalaceStatisticSection />
      </HydrationBoundary>
    );
  } catch (error) {
    notFound();
  }
}
