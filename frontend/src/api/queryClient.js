import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes cache
      gcTime: 30 * 60 * 1000, // 30 minutes garbage collection
      retry: 2, // Automatically retry failed API requests up to 2 times
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
      refetchOnWindowFocus: false,
    },
  },
});
