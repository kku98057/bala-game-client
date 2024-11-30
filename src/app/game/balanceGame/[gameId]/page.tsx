import { QUERYKEYS } from "@/queryKeys";

import { QueryClient, dehydrate, Hydrate } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import BalaceGameSection from "./_components/BalaceGameSection";
import { getBalanceGameData } from "./_lib/getBalanceGameData";
import { Metadata } from "next";
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
  const gameData = await getBalanceGameData(NumberId);
  // 메타데이터 생성
  return {
    title: `${gameData.title} | ${DEFAULT_METADATA.siteName}`,
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
export default async function page({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const queryClient = new QueryClient();

  try {
    const NumberId = Number((await params).gameId);

    const gameData = await getBalanceGameData(NumberId);
    if (!gameData) {
      notFound();
    }

    await queryClient.prefetchQuery({
      queryKey: QUERYKEYS.balanceGame.list(NumberId),
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
          name: `${gameData.title} | ${DEFAULT_METADATA.siteName}`,
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
      <Hydrate state={dehydrateState}>
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="beforeInteractive" // 이 부분 추가
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <BalaceGameSection />
      </Hydrate>
    );
  } catch (error) {
    notFound();
  }
}
