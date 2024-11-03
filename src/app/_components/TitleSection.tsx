import { motion } from "framer-motion";
import TitleText from "./TitleText";

import { ReactNode } from "react";

export default function TitleSection({
  children,
  title,
  subTitle,
}: {
  children?: ReactNode;
  title: string;
  subTitle?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col gap-6 items-center mb-12 sm:mb-16 md:mb-24 
       sm:flex-row sm:justify-between sm:items-end"
    >
      {/* 제목 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full text-center sm:text-left"
      >
        <TitleText>
          <span className="bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">
            {title}
          </span>
          <span className="text-white"> {subTitle || "리스트"}</span>
        </TitleText>
      </motion.div>

      {/* 버튼 그룹 */}
      <motion.div
        className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
