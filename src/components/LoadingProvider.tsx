'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import Loader from '@/components/Loader';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setIsLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => {
      setTimeout(() => setIsLoading(false), 600);
    };

    handleStart();
    handleComplete();

    return () => {
      setIsLoading(false);
    };
  }, [pathname, searchParams]);

  const contextValue: LoadingContextType = {
    isLoading,
    setIsLoading: (loading: boolean) => setIsLoading(loading),
  };

  return (
    <LoadingContext.Provider value={contextValue}>
      {isLoading && <Loader />}
      {children}
    </LoadingContext.Provider>
  );
}
