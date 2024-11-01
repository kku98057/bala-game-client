import { GameProps } from "@/app/types/gameType";
import confetti from "canvas-confetti";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { FiShare2, FiBarChart2 } from "react-icons/fi"; // 아이콘 사용

export const ResultView = ({
  result,
  resultRef,
}: {
  result: GameProps;
  resultRef: React.RefObject<HTMLDivElement>;
}) => {
  useEffect(() => {
    // 초기 상태 설정
    gsap.set([".result-image", ".result-title", ".result-buttons button"], {
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
        ".result-buttons button",
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

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "밸런스 게임 결과",
          text: `내가 선택한 답은 "${result.name}"입니다!`,
          url: window.location.href,
        });
      } else {
        // 클립보드에 복사
        await navigator.clipboard.writeText(window.location.href);
        alert("링크가 복사되었습니다!");
      }
    } catch (error) {
      console.error("공유 실패:", error);
    }
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

        {/* 결과 제목 */}
        <h2 className="result-title text-center text-4xl font-bold text-white mb-8">
          {result.name}
        </h2>

        {/* 버튼 그룹 */}
        <div className="result-buttons flex flex-col gap-4">
          <button
            onClick={handleShare}
            className="group relative w-full flex items-center justify-center py-4 px-6 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <FiShare2 className="mr-2" />
            <span>공유하기</span>
            <div className="absolute inset-0 rounded-xl border-2 border-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </button>

          <button
            onClick={() => {
              /* 통계 보기 로직 */
            }}
            className="group relative w-full flex items-center justify-center py-4 px-6 bg-zinc-700 hover:bg-zinc-600 rounded-xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <FiBarChart2 className="mr-2" />
            <span>통계 보기</span>
            <div className="absolute inset-0 rounded-xl border-2 border-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </button>
        </div>

        {/* 재시작 버튼 */}
        <button
          onClick={() => window.location.reload()}
          className="w-full mt-8 py-3 text-zinc-400 hover:text-white transition-colors duration-200"
        >
          다시 시작하기
        </button>
        <Link
          href={"/balanceGame/create"}
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
