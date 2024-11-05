import { useEffect } from "react";

export default function useKakaoShare() {
  const handleKakaoShare = ({
    title,
    description,
    shareUrl,
    imageUrl,
    resultUrl,
  }: {
    title: string;
    description: string;
    shareUrl: string;
    imageUrl: string;
    resultUrl?: string;
  }) => {
    window.Kakao.Share?.sendDefault({
      objectType: "feed",
      content: {
        title: title,
        description: description,
        imageUrl: imageUrl,
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
      buttons: [
        {
          title: "게임 참여하기",
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
        ...(resultUrl
          ? [
              {
                title: "결과 보기",
                link: {
                  mobileWebUrl: resultUrl,
                  webUrl: resultUrl,
                },
              },
            ]
          : []),
      ],
    });
  };
  useEffect(() => {
    // Kakao SDK 초기화
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_API_KEY);
    }
  }, []);
  return {
    handleKakaoShare,
  };
}
