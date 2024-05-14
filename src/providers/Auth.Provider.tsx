'use client';

import { useEffect, useState } from 'react';

import { onAuthStateChanged } from 'firebase/auth';

import { firebaseAuth } from '@/libs';

import { ParentReactNode } from '@/types';

export const AuthProvider = ({ children }: ParentReactNode) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth, user => {
      setIsLoading(false);
      setIsAuthenticated(!!user);
    });
  }, []);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) console.log('not authenticated');
  }, [isLoading, isAuthenticated]);

  return isLoading ? null : children;
};
