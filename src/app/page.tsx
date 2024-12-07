import Script from "next/script";
import Footer from "./_components/Footer";
import Header from "./_components/Header";
import GameUseCaseSection from "./_components/mainpage/GameUseCaseSection";

import HeroSection from "./_components/mainpage/HeroSection";
import WhyBalansomeSection from "./_components/mainpage/WhyBalansomeSection";
import { DEFAULT_METADATA } from "./enum";
import MainBalanceGameSection from "./_components/mainpage/MainBalanceGameSection";

export default function Home() {
  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        strategy="beforeInteractive" // 이 부분 추가
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: DEFAULT_METADATA.siteName,
            description: DEFAULT_METADATA.defaultDescription,
            url: DEFAULT_METADATA.baseUrl,
            publisher: {
              "@type": "Organization",
              name: "밸런썸",
            },
          }),
        }}
      />

      <main className="bg-gradient-to-b from-zinc-900 to-zinc-800 min-h-dvh ">
        <HeroSection />
        {/* <GameUseCaseSection /> */}
        <MainBalanceGameSection />
        <WhyBalansomeSection />
        <Footer />
      </main>
    </>
  );
}
