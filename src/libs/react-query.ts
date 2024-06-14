import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: 5000,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      gcTime: 10 * 60 * 1000,
    },
  },
});
