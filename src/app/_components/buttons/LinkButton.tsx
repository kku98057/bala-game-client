import Link from "next/link";
import { ReactNode } from "react";

export default function LinkButton({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white rounded-xl hover:bg-[#1D4ED8] transition-all duration-300"
    >
      {children}
    </Link>
  );
}
