"use client";
import useUser from "@/hooks/useUser";

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useUser();
  return <>{children}</>;
}
