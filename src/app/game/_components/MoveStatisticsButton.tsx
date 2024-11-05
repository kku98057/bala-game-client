import Link from "next/link";

export default function MoveStatisticsButton({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="group relative inline-flex items-center gap-2 px-6 py-3 bg-indigo-600/90 backdrop-blur hover:bg-indigo-600 rounded-xl text-indigo-200 hover:text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-indigo-950/20"
    >
      <span>통계 보러가기</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 "
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>{" "}
      <div className="absolute inset-0 rounded-xl border border-indigo-500/50 group-hover:border-indigo-400/50 transition-colors duration-300" />
    </Link>
  );
}
