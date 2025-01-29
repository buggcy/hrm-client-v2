'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';

// import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';

// import { toast } from '@/components/ui/use-toast';
// import { getPermissions } from '@/services/auth.service';
import { AuthStoreType } from '@/stores/auth';

import { useStores } from './Store.Provider';

import { ParentReactNode } from '@/types';

export const AuthProvider = ({ children }: ParentReactNode) => {
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const {
    user,
    setUser,
    resetSession,
    // setAccessPermissions,
    // setReadPermissions,
    // setWritePermissions,
    // accessPermissions,
    // readPermissions,
    // writePermissions,
  } = authStore;

  const pathname = usePathname();
  const router = useRouter();

  const allowedRoutes = useMemo(
    () => ['/profile', '/all-notifications', '/profile-setting'],
    [],
  );

  // const { mutate, data: userData } = useMutation({
  //   mutationFn: ({ id }: { id: string }) => getPermissions(id),
  //   onError: err => {
  //     toast({
  //       title: 'Error',
  //       description: err?.message || 'Error on fetching stats data!',
  //       variant: 'error',
  //     });
  //   },
  // });

  // useEffect(() => {
  //   if (
  //     user &&
  //     user.id &&
  //     (!accessPermissions.length ||
  //       !readPermissions.length ||
  //       !writePermissions.length)
  //   ) {
  //     mutate({ id: user.id });
  //   }
  // }, [
  //   user,
  //   mutate,
  //   accessPermissions.length,
  //   readPermissions.length,
  //   writePermissions.length,
  // ]);

  // useEffect(() => {
  //   if (userData && userData.permissions && userData.permissions.length > 0) {
  //     const accessPermissions = userData.permissions.filter(permission =>
  //       permission.name.startsWith('access'),
  //     );
  //     const readPermissions = userData.permissions.filter(permission =>
  //       permission.name.startsWith('canRead'),
  //     );
  //     const writePermissions = userData.permissions.filter(permission =>
  //       permission.name.startsWith('canWrite'),
  //     );
  //     setAccessPermissions(accessPermissions);
  //     setReadPermissions(readPermissions);
  //     setWritePermissions(writePermissions);
  //   }
  // }, [setAccessPermissions, setReadPermissions, setWritePermissions, userData]);

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
