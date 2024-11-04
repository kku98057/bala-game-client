import { DEFAULT_METADATA } from "@/app/enum";
import { GameTypeProps } from "@/app/types/types";
import { Metadata, ResolvingMetadata } from "next";

interface GameData {
  id: number;
  title: string;
  description?: string;
  thumbnail?: string;
  creator?: {
    name: string;
  };
  createdAt: string;
  maxPlayers?: number;
}

interface GenerateGameMetadataProps {
  gameData: GameData | null;
  gameType: GameTypeProps;
  isStatistics?: boolean;
}

export function generateGameMetadata({
  gameData,
  gameType,
  isStatistics,
}: GenerateGameMetadataProps): Metadata {
  if (!gameData) {
    return {
      title: "게임을 찾을 수 없습니다 - 밸런썸",
      description: "요청하신 게임을 찾을 수 없습니다.",
    };
  }

  const title = `${gameData.title} ${isStatistics ? "통계" : ""} | ${
    DEFAULT_METADATA.siteName
  }`;
  const description =
    gameData.description || `${DEFAULT_METADATA.defaultDescription}`;
  const url = `${DEFAULT_METADATA.baseUrl}/game/${
    gameType === "BALANCE" ? "balanceGame" : "tournamentGame"
  }/${gameData.id}`;
  const thumbnail =
    gameData.thumbnail || `${DEFAULT_METADATA.defaultThumbnail}`;

  return {
    title,
    description,
    icons: {
      icon: `/imgs/logo.png`,
    },
    openGraph: {
      title,
      description,
      type: "website", // game -> website로 변경
      url,
      images: [
        {
          url: thumbnail,
          width: 1200,
          height: 630,
          alt: gameData.title,
        },
      ],
      siteName: "밸런썸 (Balancesome)",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [thumbnail],
    },
    other: {
      "application-name": "밸런썸",
      // OG 게임 정보를 별도의 태그로 추가
      "og:game:type": gameType,
      "schema:game": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Game",
        name: gameData.title,
        description: gameData.description,
        url,
        image: thumbnail,
        author: {
          "@type": "Person",
          name: gameData.creator?.name || "밸런썸 유저",
        },
        datePublished: gameData.createdAt,
        genre: gameType,
        numberOfPlayers: {
          "@type": "QuantitativeValue",
          minValue: 1,
          maxValue: gameData.maxPlayers || "unlimited",
        },
      }),
    },
  };
}
