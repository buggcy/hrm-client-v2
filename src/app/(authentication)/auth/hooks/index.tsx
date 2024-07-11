import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useUserQuery } from '@/hooks';
import { firebaseAuth } from '@/libs';

export const useRedirectAfterAuth = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user } = useUserQuery({
    enabled: !!firebaseAuth.currentUser,
  });

  useEffect(() => {
    if (user) {
      if (user.billingAccount?.status === null) router.push('/billing');
      else if (pathname.startsWith('/auth')) router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
};
