import { DEFAULT_METADATA } from "@/app/enum";
import { GameTypeProps } from "@/app/types/types";
import { Metadata } from "next";

interface GenerateGameMetadataProps {
  gameData: any;
  gameType: GameTypeProps;
  isStatistics?: boolean;
}

export function generateGameMetadata({
  gameData,
  gameType,
  isStatistics,
}: GenerateGameMetadataProps): {
  metaTag: Metadata;
  structuredData?: any;
} {
  if (!gameData) {
    return {
      metaTag: {
        title: "게임을 찾을 수 없습니다 - 밸런썸",
        description: "요청하신 게임을 찾을 수 없습니다.",
      },
      structuredData: null,
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

  const metaTag = () => {
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website", // game -> website로 변경
        url,
        siteName: "밸런썸 (Balancesome)",
        images: DEFAULT_METADATA.defaultThumbnail,
      },
    };
  };

  const structuredData = () => {
    return {
      "application-name": "밸런썸",
      // OG 게임 정보를 별도의 태그로 추가
      "og:game:type": gameType,
      "schema:game": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Game",
        name: gameData.title,
        description: gameData.description,
        url,
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
    };
  };

  return {
    metaTag: metaTag(),
    structuredData: structuredData(),
  };
}
