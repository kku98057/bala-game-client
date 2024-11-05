import { FiShare2 } from "react-icons/fi";
import { motion } from "framer-motion";
type ButtonVariant = "primary" | "secondary" | "outline";

export default function ShareButton({
  title = "친구들한테 자랑하기",
  handlerShare,
  variant = "primary",
}: {
  title?: string;
  handlerShare: () => void;
  variant?: ButtonVariant;
}) {
  const getVariantStyles = (variant: ButtonVariant) => {
    switch (variant) {
      case "primary":
        return "bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-400";
      case "secondary":
        return "bg-pink-100 hover:bg-pink-200 text-pink-700 border-pink-300";
      case "outline":
        return "bg-white hover:bg-indigo-50 text-indigo-600 border-2 border-indigo-200 hover:border-indigo-400";
      default:
        return "bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-400";
    }
  };

  return (
    <motion.button
      onClick={handlerShare}
      className={`group relative w-full flex items-center justify-center py-4 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl ${getVariantStyles(
        variant
      )}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <FiShare2 className="mr-2" />
      <span>{title}</span>
      <div
        className={`absolute inset-0 rounded-xl border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
          variant === "outline"
            ? "border-indigo-600"
            : getVariantStyles(variant)
                .split(" ")
                .find((c) => c.startsWith("border-"))
        }`}
      />
    </motion.button>
  );
}
