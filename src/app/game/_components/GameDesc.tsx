"use client";

import { motion } from "framer-motion";

export default function GameDesc({
  description,
  delay = 0.6,
}: {
  description: string;
  delay?: number;
}) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay }}
      className="text-zinc-400 text-sm py-2"
    >
      {description}
    </motion.p>
  );
}
