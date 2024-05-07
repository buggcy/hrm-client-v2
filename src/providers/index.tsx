import { lazy, Suspense, useEffect, useState } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';

import { isProd } from '@/constants';
import { queryClient } from '@/utils';

import { ParentReactNode } from '@/types';

const ReactQueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools/build/modern/production.js').then(
    d => ({ default: d.ReactQueryDevtools }),
  ),
);

export const ReactQueryProvider = ({ children }: ParentReactNode) => {
  const [showDevtools, setShowDevtools] = useState(!isProd);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window.toggleDevtools = () => setShowDevtools(old => !old);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {showDevtools && (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen />
        </Suspense>
      )}
    </QueryClientProvider>
  );
};
