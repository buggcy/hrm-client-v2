'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { onAuthStateChanged } from 'firebase/auth';

import { SignIn } from '@/components/SignIn';

import { firebaseAuth } from '@/libs';

import { ParentReactNode } from '@/types';

export const AuthProvider = ({ children }: ParentReactNode) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth, user => {
      setIsLoading(false);
      setIsAuthenticated(!!user);
    });
  }, []);

  if (isLoading) return null;
  if (!isAuthenticated && !pathname.startsWith('/auth')) return <SignIn />;

  return children;
};
