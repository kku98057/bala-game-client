import { useEffect } from "react";
declare global {
  interface Window {
    adsbygoogle: any;
  }
}
export default function GoogleAdSenseComponent2() {
  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);
  return (
    <div className="w-full flex items-center justify-center">
      <ins
        className="adsbygoogle example_responsive_1"
        style={{ display: "block" }}
        data-ad-client="ca-pub-3604338976078798"
        data-ad-slot="6734164461"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
