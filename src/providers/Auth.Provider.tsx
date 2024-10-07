'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import Cookies from 'js-cookie';

import { AuthStoreType } from '@/stores/auth';

import { useStores } from './Store.Provider';

import { ParentReactNode } from '@/types';

export const AuthProvider = ({ children }: ParentReactNode) => {
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user, setUser, resetSession } = authStore;

  const pathname = usePathname();
  const router = useRouter();

  const allowedRoutes = useMemo(() => ['/profile', '/all-notifications'], []);

  useEffect(() => {
    const cookieToken = Cookies.get('hrmsToken');

    if (cookieToken && !user) {
      setUser(cookieToken);
    } else if (!cookieToken) {
      resetSession();
    }

    if (!cookieToken) {
      if (!pathname.startsWith('/auth')) {
        router.push('/auth/sign-in');
      }
    } else {
      if (user) {
        if (allowedRoutes.some(route => pathname.startsWith(route))) {
          return;
        }
        if (user.roleId === 1) {
          if (
            pathname.startsWith('/employee') ||
            pathname.startsWith('/manager')
          ) {
            router.push('/hr/dashboard');
          } else if (!pathname.startsWith('/hr')) {
            router.push('/hr/dashboard');
          }
        } else if (user.roleId === 2) {
          if (pathname.startsWith('/hr') || pathname.startsWith('/manager')) {
            router.push('/employee/dashboard');
          } else if (!pathname.startsWith('/employee')) {
            router.push('/employee/dashboard');
          }
        } else if (user.roleId === 3) {
          if (pathname.startsWith('/hr') || pathname.startsWith('/employee')) {
            router.push('/manager/dashboard');
          } else if (!pathname.startsWith('/manager')) {
            router.push('/manager/dashboard');
          }
        }
      }
    }
  }, [user, pathname, router, setUser, resetSession, allowedRoutes]);

  return children;
};
