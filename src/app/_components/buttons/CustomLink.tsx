import Link from "next/link";
import { ReactNode } from "react";

interface CustomLinkProps {
  href: string;
  variant?: "primary" | "secondary";
  children: ReactNode;
  className?: string;
  icon?: "plus" | "arrow";
  iconPosition?: "left" | "right";
}
const icons = {
  plus: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
  ),
  arrow: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  ),
};
export default function CustomLink({
  href,
  variant = "primary",
  children,
  className = "",
  icon,
  iconPosition = "left",
}: CustomLinkProps) {
  const baseStyles =
    "group relative px-4 sm:px-8 py-2 sm:py-4 rounded-lg sm:rounded-xl text-white font-semibold transition-all duration-200 w-full sm:w-auto overflow-hidden text-sm sm:text-base";

  const variants = {
    primary: {
      background: "bg-indigo-500 hover:bg-indigo-700",
      border: "border-indigo-400",
    },
    secondary: {
      background: "bg-zinc-700 hover:bg-zinc-600",
      border: "border-zinc-500",
    },
  };

  const selectedVariant = variants[variant];

  return (
    <Link
      href={href}
      className={`${baseStyles} ${selectedVariant.background} ${className}`}
    >
      <span className="flex items-center justify-center gap-1.5 sm:gap-2 relative z-10 whitespace-nowrap">
        {icon && iconPosition === "left" && icons[icon]}
        {children}
        {icon && iconPosition === "right" && icons[icon]}
      </span>
      <div
        className={`absolute inset-0 rounded-lg sm:rounded-xl border-2 ${selectedVariant.border} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
      />
    </Link>
  );
}
