"use client";
import Link from "next/link";
import { IconType } from "react-icons";
import { motion } from "framer-motion";

interface GameCardProps {
  href: string;
  icon: IconType;
  title: string;
  description: string;
  delay: number;
}

export default function GameCard({
  href,
  icon: Icon,
  title,
  description,
  delay,
}: GameCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        href={href}
        className="group block relative overflow-hidden rounded-2xl transition-all duration-300 aspect-[4/3] bg-white"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-200 z-0" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-slate-900/5 transition-all duration-300 z-10" />
        <div className="relative h-full w-full p-8 flex flex-col items-center justify-center text-slate-700 z-20">
          <Icon className="text-6xl mb-4 transition-all duration-300 group-hover:scale-110" />
          <h3 className="text-2xl font-bold mb-3 text-center transition-transform duration-300 group-hover:translate-y-[-2px]">
            {title}
          </h3>
          <p className="text-sm text-center text-slate-600 max-w-xs opacity-80 transition-all duration-300 group-hover:opacity-100">
            {description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
