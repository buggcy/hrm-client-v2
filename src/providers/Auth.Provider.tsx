'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { SignIn } from '@/app/(authentication)/auth/sign-in/components/SignIn';

import { ParentReactNode } from '@/types';

export const AuthProvider = ({ children }: ParentReactNode) => {
  const [isLoading] = useState(false);
  const [isAuthenticated] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // return onAuthStateChanged(firebaseAuth, user => {
    //   setIsLoading(false);
    //   setIsAuthenticated(!!user);
    // });
  }, []);

  if (isLoading) return null;
  if (!isAuthenticated && !pathname.startsWith('/auth')) return <SignIn />;

  return children;
};
