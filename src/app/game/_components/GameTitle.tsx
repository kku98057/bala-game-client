import { motion } from "framer-motion";
export default function GameTitle({ title }: { title: string }) {
  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };
  return (
    <motion.h1
      className="text-2xl md:text-5xl font-bold text-white mb-8 leading-tight"
      variants={titleVariants}
    >
      <motion.span
        className="text-indigo-400 mt-3 block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        variants={titleVariants}
      >
        {title}
      </motion.span>
    </motion.h1>
  );
}
