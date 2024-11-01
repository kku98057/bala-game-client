import type { Metadata } from "next";

import "./globals.css";
import ReactQueryProviders from "@/hooks/useReactQuery";
import Script from "next/script";

export const metadata: Metadata = {
  title: "밸런썸 (Balancesome)",
  description:
    "밸런썸 (Balancesome) 밸런스 게임을 만들고 즐기고 공유하고 랭킹을 확인하세요!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>
        <Script
          strategy="beforeInteractive"
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
          integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
          crossOrigin="anonymous"
        ></Script>{" "}
        <ReactQueryProviders>{children}</ReactQueryProviders>
      </body>
    </html>
  );
}
