'use client';

import { lazy, Suspense, useEffect, useState } from 'react';

import { QueryClientProvider as TanstackQueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '@/libs';

import { ParentReactNode } from '@/types';

const ReactQueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools/build/modern/production.js').then(
    d => ({ default: d.ReactQueryDevtools }),
  ),
);

export const QueryClientProvider = ({ children }: ParentReactNode) => {
  const [showDevtools, setShowDevtools] = useState(false);

  useEffect(() => {
    window.toggleDevtools = () => setShowDevtools(old => !old);
  }, []);

  return (
    <TanstackQueryClientProvider client={queryClient}>
      {children}
      {showDevtools && (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen />
        </Suspense>
      )}
    </TanstackQueryClientProvider>
  );
};
