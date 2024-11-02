import { GameProps } from "@/app/types/gameType";
import confetti from "canvas-confetti";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";
import { FiShare2, FiBarChart2 } from "react-icons/fi"; // 아이콘 사용
declare global {
  interface Window {
    Kakao: any;
  }
}
export const ResultView = ({
  result,
  resultRef,
}: {
  result: GameProps;
  resultRef: React.RefObject<HTMLDivElement>;
}) => {
  const { gameId } = useParams();
  useEffect(() => {
    // 초기 상태 설정
    gsap.set([".result-image", ".result-title", ".result-buttons a"], {
      opacity: 0,
    });

    // 결과 화면 진입 애니메이션
    const tl = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
    });

    tl.fromTo(
      ".result-image",
      {
        scale: 0.8,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: "back.out",
      }
    )
      .fromTo(
        ".result-title",
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
        }
      )
      .fromTo(
        ".result-buttons a",
        {
          y: 20,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.2,
        }
      );

    // 축하 효과
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    // 클린업
    return () => {
      tl.kill();
    };
  }, []);
  // 랜덤 결과 메시지 선택
  const resultMessages = [
    `당신의 선택은 "${result.name}"! 센스가 아주 좋으시네요 👍`,
    `"${result.name}" 특급 안목이십니다! 👀`,
    `역시! "${result.name}"만한 게 없죠! ⭐`,
    `"${result.name}" 찍으신 분? 당신이군요! 🎯`,
    `오늘의 승자는 "${result.name}"입니다! 🏆`,
  ];

  // 랜덤 공유 메시지
  const shareMessages = [
    `내가 골라도 "${result.name}"을(를) 고르겠어!`,
    `이거 실화? 내가 고른 "${result.name}" 어때요?`,
    `고민 끝에 선택한 "${result.name}", 당신의 선택은?`,
    `"${result.name}" 찍은 사람 여기 있네요!`,
    `토너먼트계 끝판왕의 선택 "${result.name}"`,
  ];

  useEffect(() => {
    // Kakao SDK 초기화
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_API_KEY);
    }
  }, []);

  const [randomMessage, setRandomMessage] = useState("");
  useEffect(() => {
    setRandomMessage(
      resultMessages[Math.floor(Math.random() * resultMessages.length)]
    );
  }, []);

  const shareMessage =
    shareMessages[Math.floor(Math.random() * shareMessages.length)];
  const handleKakaoShare = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?result=${result.id}`;

    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "토너먼트 결과",
        description: `내가 선택한 답은 "${result.name}"입니다! 당신의 선택은?`,
        imageUrl: result.imageUrl,
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
        {
          title: "결과 보기",
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      ],
    });
  };
  return (
    <div
      ref={resultRef}
      className="w-full min-h-dvh bg-gradient-to-b from-zinc-900 to-zinc-800 flex flex-col items-center justify-center px-4"
    >
      <div className="max-w-md w-full space-y-8">
        {/* 결과 이미지 */}
        <div className="result-image relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src={result.imageUrl}
            alt={result.name}
            fill
            className="object-cover "
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        <div className="result-title text-center space-y-2">
          <h2 className="text-4xl font-bold text-white">{result.name}</h2>
          <p className="text-indigo-400 text-lg">{randomMessage}</p>
        </div>

        {/* 버튼 그룹 */}
        <div className="result-buttons flex flex-col gap-4">
          <button
            onClick={handleKakaoShare}
            className="group relative w-full flex items-center justify-center py-4 px-6 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <FiShare2 className="mr-2" />
            <span>친구들한테 자랑하기</span>
            <div className="absolute inset-0 rounded-xl border-2 border-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </button>

          <Link
            href={`/game/tournamentGame/${gameId}/statistics`}
            className="group relative w-full flex items-center justify-center py-4 px-6 bg-zinc-700 hover:bg-zinc-600 rounded-xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <FiBarChart2 className="mr-2" />
            <span>다른 사람들은 뭘 골랐을까?</span>
            <div className="absolute inset-0 rounded-xl border-2 border-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </Link>
        </div>

        {/* 재시작 버튼 */}
        <button
          onClick={() => {
            const baseUrl = window.location.href.split("?")[0];
            window.location.href = baseUrl;
          }}
          className="w-full mt-8 py-3 text-zinc-400 hover:text-white transition-colors duration-200"
        >
          다시 시작하기
        </button>
        <Link
          href={"/game/tournamentGame/create"}
          role="button"
          aria-label="게임 만들기"
          className="flex items-center justify-center w-full mt-8 py-3 text-zinc-400 hover:text-white transition-colors duration-200"
        >
          나도 게임 만들기
        </Link>
      </div>
    </div>
  );
};
