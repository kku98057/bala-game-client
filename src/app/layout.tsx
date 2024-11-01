import type { Metadata } from "next";

import "./globals.css";
import ReactQueryProviders from "@/hooks/useReactQuery";

export const metadata: Metadata = {
  title: "바라바라 밸런스게임",
  description:
    "바라바라 밸런스 게임을 만들고 즐기고 공유하고 랭킹을 확인하세요!",
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
        {" "}
        <ReactQueryProviders>{children}</ReactQueryProviders>
      </body>
    </html>
  );
}
