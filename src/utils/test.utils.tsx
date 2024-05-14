import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ParentReactNode } from '@/types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export const wrapper = ({ children }: ParentReactNode) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
