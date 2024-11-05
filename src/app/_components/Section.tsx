import { ReactNode } from "react";
interface CustomSectionProps {
  variant?: "primary" | "secondary";
  children: ReactNode;
  className?: string;
}
export default function Section({
  variant = "primary",
  className,
  children,
}: CustomSectionProps) {
  const baseStyles = "w-full  px-4 max-w-screen-2xl mx-auto";

  const variants = {
    primary: {
      padding: "pt-24",
    },
    secondary: {
      padding: "pt-0",
    },
  };
  return (
    <section
      className={`${baseStyles} ${variants[variant].padding} ${className}`}
    >
      {children}
    </section>
  );
}
