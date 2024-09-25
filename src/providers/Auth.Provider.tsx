'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { AuthStoreType } from '@/stores/auth';

import { useStores } from './Store.Provider';

import { ParentReactNode } from '@/types';

export const AuthProvider = ({ children }: ParentReactNode) => {
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { token, user } = authStore;

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      if (!pathname.startsWith('/auth')) {
        router.push('/auth/sign-in');
      }
    } else {
      if (user?.roleId === 1) {
        if (
          pathname.startsWith('/employee') ||
          pathname.startsWith('/manage')
        ) {
          router.push('/hr/dashboard');
        } else if (!pathname.startsWith('/hr')) {
          router.push('/hr/dashboard');
        }
      } else if (user?.roleId === 2) {
        if (pathname.startsWith('/hr') || pathname.startsWith('/manage')) {
          router.push('/employee/dashboard');
        } else if (!pathname.startsWith('/employee')) {
          router.push('/employee/dashboard');
        }
      } else if (user?.roleId === 3) {
        if (pathname.startsWith('/hr') || pathname.startsWith('/employee')) {
          router.push('/manage/dashboard');
        } else if (!pathname.startsWith('/manage')) {
          router.push('/manage/dashboard');
        }
      }
    }
  }, [token, pathname, router, user]);

  return children;
};
