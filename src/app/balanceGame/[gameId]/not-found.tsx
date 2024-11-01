import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <h2 className="text-3xl font-bold text-white mb-4">
        존재하지 않는 게임입니다
      </h2>
      <p className="text-gray-400 mb-8">
        요청하신 밸런스 게임을 찾을 수 없습니다.
      </p>
      <Link
        href="/balanceGame"
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        게임 목록으로 돌아가기
      </Link>
    </div>
  );
}
