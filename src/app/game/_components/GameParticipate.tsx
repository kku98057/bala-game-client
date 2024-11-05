import { motion, MotionValue } from "framer-motion";
export default function GameParticipate({
  rounded,
}: {
  rounded: MotionValue<string>;
}) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="text-white text-lg "
    >
      참여자 수:{" "}
      <motion.span
        className="font-bold text-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {rounded}
      </motion.span>
    </motion.p>
  );
}
