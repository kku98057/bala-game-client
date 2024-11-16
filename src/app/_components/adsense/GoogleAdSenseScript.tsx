import Script from "next/script";

export default function GoogleAdSenseScript() {
  //   if (process.env.NODE_ENV !== "production") {
  //     return null;
  //   }
  return (
    <Script
      async
      strategy="lazyOnload"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3604338976078798"
      crossOrigin="anonymous"
    ></Script>
  );
}
