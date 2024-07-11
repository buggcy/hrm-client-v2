'use client';

import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';

import packageJson from '../../package.json';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: 5000,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      gcTime: 10 * 60 * 1000,
    },
  },
});

if (typeof window !== 'undefined') {
  const persister = createSyncStoragePersister({
    storage: window.localStorage,
  });

  void persistQueryClient({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    queryClient,
    persister,
    maxAge: 1000 * 60 * 60 * 24,
    buster: packageJson.version,
  });
}
