import { Metadata } from "next";
import defaultMetaDatas from "../_components/metadata/defaultMetaDatas";
import GameListSection from "./_components/GameListSection";
import Script from "next/script";
import { DEFAULT_METADATA } from "../enum";
export const metadata: Metadata = defaultMetaDatas({});
export default function GameMainPage() {
  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `게임 리스트 | ${DEFAULT_METADATA.siteName}`,
            description: "밸런썸의 모든 게임 목록을 확인하세요",
            url: `https://balansome.co.kr/game`,
            publisher: {
              "@type": "Organization",
              name: "밸런썸",
            },
            about: {
              "@type": "Thing",
              name: `게임 리스트 | ${DEFAULT_METADATA.siteName}`,
            },
          }),
        }}
      />
      <GameListSection limit={10} />;
    </>
  );
}
