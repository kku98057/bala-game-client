import { animate, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

export default function useCounterUp(initialValue: number) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) =>
    Math.round(latest).toLocaleString()
  );

  useEffect(() => {
    if (initialValue) {
      const animation = animate(count, initialValue, {
        duration: 1.5,
        delay: 0.8,
        ease: "easeIn",
      });

      return animation.stop;
    }
  }, [initialValue]);
  return { rounded };
}
