import { useEffect } from "react";
declare global {
  interface Window {
    adsbygoogle: any;
  }
}
export default function GoogleAdSenseComponent() {
  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);
  return (
    <div className="my-2 ">
      {" "}
      {/* 컨테이너 크기 제한 */}
      {/* <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-3604338976078798"
        data-ad-slot="4815843481"
        data-ad-format="auto"
        data-full-width-responsive="false"
        data-adtest="on"
      ></ins> */}
      <ins
        className="adsbygoogle"
        style={{
          display: "inline-block",
          width: "250px",
          height: "90px",
        }}
        data-ad-client="ca-pub-3604338976078798"
        data-ad-slot="4815843481"
      ></ins>
    </div>
  );
}
