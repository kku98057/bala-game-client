import TournamentGameListSection from "./_components/TournamentGameListSection";
import { Metadata } from "next";
import Script from "next/script";
import { DEFAULT_METADATA } from "@/app/enum";

const title = `${DEFAULT_METADATA.siteName} | 이상형 월드컵 리스트`;
const description = "당신이 생각하는 가장 최고의 선택은?";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
};
export default async function GamePage() {
  const limit = 10;

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
            name: title,
            description,
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/game/balanceGame`,
            publisher: {
              "@type": "Organization",
              name: "밸런썸",
            },
          }),
        }}
      />
      <TournamentGameListSection limit={limit} />;
    </>
  );
}
