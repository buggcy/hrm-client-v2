'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { isPast, isYesterday } from 'date-fns';

import BillingPlansPage from '@/app/(portal)/(billing)/billing/page';
import { usePersistentState, useUserQuery } from '@/hooks';

import { BillingAccountStatus, ParentReactNode } from '@/types';

function isYesterdayOrEarlier(date: Date) {
  return isYesterday(date) || isPast(date);
}

export const BillingProvider = ({ children }: ParentReactNode) => {
  const [dateHasBeenRedirected, setDateHasBeenRedirected] = usePersistentState(
    'hasBeenRedirectedToBilling',
    '',
  );
  const { isPending, data: user } = useUserQuery();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (
      user?.billingAccount?.status === BillingAccountStatus.PAYMENT_FAILED &&
      !pathname.startsWith('/billing') &&
      isYesterdayOrEarlier(new Date(dateHasBeenRedirected || 0))
    ) {
      router.push('/billing');
      setDateHasBeenRedirected(new Date().toISOString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (isPending) return null;
  // NOTE: If the user has never been fulfilled his billing info, redirect to the billing plans page
  if (user?.billingAccount?.status === null) return <BillingPlansPage />;

  return children;
};
