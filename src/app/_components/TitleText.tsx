"use client";
import { ReactNode } from "react";

interface TitleProps {
  children: ReactNode;
  buttonsChildren?: ReactNode;
}
export default function TitleText({ children }: TitleProps) {
  return (
    <>
      <h3 className="text-xl sm:text-3xl font-bold  text-white">{children}</h3>
    </>
  );
}
