"use client";

import { useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function ReactQueryProviders({
  children,
}: React.PropsWithChildren) {
  const minute = 60 * 1000;
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime

            // above 0 to avoid refetching immediately on the client
            retry: 0,
            staleTime: minute * 10,
            cacheTime: minute * 30,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
