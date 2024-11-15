"use client";

import { usePathname } from "next/navigation";

export function CanonicalTag() {
  const pathname = usePathname();

  return <link rel="canonical" href={`https://balansome.co.kr${pathname}`} />;
}
