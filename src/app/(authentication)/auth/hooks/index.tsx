import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { CancelledError } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { Button } from '@/components/ui/button';
import { Toast, toast } from '@/components/ui/use-toast';

import { DEVELOPER_SUPPORT_EMAIL, DEVELOPER_SUPPORT_LINK } from '@/constants';
import { useUserQuery } from '@/hooks';
import { firebaseAuth } from '@/libs';
import { NonDeveloperError } from '@/services';
import { getQueryParamsString } from '@/utils';

import { BillingAccountStatus } from '@/types';

export const useRedirectAfterAuth = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { data: user } = useUserQuery({
    enabled: !!firebaseAuth.currentUser,
  });

  useEffect(() => {
    if (user) {
      const plan = searchParams.get('plan');
      const coupon = searchParams.get('coupon');

      if (
        plan ||
        coupon ||
        user.billingAccount?.status !== BillingAccountStatus.ACTIVE
      ) {
        const paramsStr = getQueryParamsString({ plan, coupon });
        router.push('/billing' + (paramsStr ? `?${paramsStr}` : ''));
      } else if (pathname.startsWith('/auth')) {
        if (pathname.startsWith('/auth/sign-up')) router.push('/billing');
        else router.push('/');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
};

const nonDeveloperToastDescription = (
  <>
    If you think there’s a mistake, or are interested in the Tavus Developer
    platform, please let us know at{' '}
    <a href={DEVELOPER_SUPPORT_LINK} className="underline">
      {DEVELOPER_SUPPORT_EMAIL}
    </a>
    <br />
    <br />
    <Button asChild variant="primary-inverted" className="ml-auto w-full">
      <a href="https://app.tavus.io">Access Tavus Business Portal</a>
    </Button>
  </>
);

export const createHandleAuthError =
  (data: Toast) => (error: Error | CancelledError) => {
    // TODO: fix to handle NonDeveloperError properly
    if (
      error instanceof NonDeveloperError ||
      (error instanceof AxiosError && error.response?.status === 401) ||
      error instanceof CancelledError
    ) {
      toast({
        title:
          'Looking for the Tavus Business Portal? Please login via the link below.',
        description: nonDeveloperToastDescription,
        variant: 'destructive',
      });
    } else
      toast({
        variant: 'error',
        ...data,
      });
  };
