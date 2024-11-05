import "./globals.css";
import ReactQueryProviders from "@/hooks/useReactQuery";
import { Metadata } from "next";
import Script from "next/script";
import { DEFAULT_METADATA } from "./enum";
export const metadata: Metadata = {
  metadataBase: new URL("https://balansome.co.kr"),

  title: `${DEFAULT_METADATA.siteName} | ${DEFAULT_METADATA.subTitle}`,
  description: DEFAULT_METADATA.defaultDescription,
  icons: "/favicon.ico",
  openGraph: {
    title: "밸런썸 (Balancesome)",
    description: DEFAULT_METADATA.defaultDescription,
    url: DEFAULT_METADATA.baseUrl,
    siteName: DEFAULT_METADATA.siteName,
    images: DEFAULT_METADATA.defaultThumbnail,
    locale: "ko_KR",
    type: "website",
  },
};
declare global {
  interface Window {
    Kakao: any;
  }
}
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
        <meta
          name="naver-site-verification"
          content="5bf1ec7d9b1db9137927d7f2f151d81a7885b897"
        />
      </head>
      <body>
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: DEFAULT_METADATA.siteName,
              description: DEFAULT_METADATA.defaultDescription,
              url: "https://balansome.co.kr",
              publisher: {
                "@type": "Organization",
                name: "밸런썸",
              },
            }),
          }}
        />
        <Script
          strategy="beforeInteractive"
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
          integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
          crossOrigin="anonymous"
        ></Script>{" "}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-G3YHG309EC"
        ></Script>
        <script
          dangerouslySetInnerHTML={{
            __html: ` window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-G3YHG309EC');`,
          }}
        ></script>
        <ReactQueryProviders>{children}</ReactQueryProviders>
      </body>
    </html>
  );
}
