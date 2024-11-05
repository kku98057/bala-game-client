import Link from "next/link";

export default function MoveListButton({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="group relative inline-flex items-center gap-2 px-6 py-3 bg-zinc-800/50 backdrop-blur hover:bg-zinc-700/50 rounded-xl text-zinc-300 hover:text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-zinc-950/20"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      목록으로 돌아가기
      <div className="absolute inset-0 rounded-xl border border-zinc-700/50 group-hover:border-zinc-500/50 transition-colors duration-300" />
    </Link>
  );
}
