"use client";
import { ReactNode } from "react";

interface TitleProps {
  children: ReactNode;
  buttonsChildren?: ReactNode;
}
export default function TitleText({ children }: TitleProps) {
  return (
    <>
      <h3 className="text-4xl font-bold text-center text-white">{children}</h3>
    </>
  );
}
