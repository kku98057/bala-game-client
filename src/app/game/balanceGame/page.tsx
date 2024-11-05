import { Metadata } from "next";
import BalanceGameListSection from "./_components/BalanceGameListSection";
import { DEFAULT_METADATA } from "@/app/enum";
import Script from "next/script";

const title = `${DEFAULT_METADATA.siteName} | 밸런스 게임 리스트`;
const description = "과연 당신은 잘 선택할 수 있을까";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
};
export default function page() {
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
      <BalanceGameListSection limit={10} />;
    </>
  );
}
