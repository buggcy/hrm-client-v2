'use client';

import { useEffect } from 'react';
import Link from 'next/link';

import { Query } from '@tanstack/react-query';
import { CheckIcon, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { SupportButton } from '@/app/(portal)/components/Navigation/components/SupportButton';
import { useUserQuery } from '@/hooks';
import { queryClient } from '@/libs';

import { LayoutCenter } from '../../components/Layout';

import { BillingAccountStatus, IUser } from '@/types';

export default function Page() {
  const { data: user } = useUserQuery({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    refetchInterval(query: Query<IUser>) {
      if (
        query.state.data?.billingAccount?.status === BillingAccountStatus.ACTIVE
      ) {
        return 3 * 1000;
      }
      return false;
    },
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (user?.billingAccount?.status !== BillingAccountStatus.ACTIVE) {
      void queryClient.refetchQueries({ queryKey: ['user', 'quotas'] });
    }
  }, [user]);

  return (
    <LayoutCenter className="flex-col">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary-foreground">
        {user?.billingAccount?.status === BillingAccountStatus.ACTIVE ? (
          <Loader2 className="size-6 animate-spin text-primary" />
        ) : (
          <CheckIcon className="size-6 text-primary" />
        )}
      </div>
      <div className="flex w-full max-w-lg flex-col items-center justify-center text-center">
        <h1 className="mb-4 text-2xl font-bold">
          {user?.billingAccount?.status === BillingAccountStatus.ACTIVE
            ? "We're processing your cancellation request"
            : 'Your subscription has been terminated'}
        </h1>
        <p className="mb-8 text-sm font-medium text-muted-foreground">
          {user?.billingAccount?.status === BillingAccountStatus.ACTIVE &&
            'Your subscription will be terminated shortly. '}
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          You'll retain access to premium features until the end of your current
          billing period. If you change your mind, you can reactivate your
          subscription at any time.
        </p>
        <div className="flex items-center justify-center gap-4">
          <SupportButton>Contact Support</SupportButton>
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </LayoutCenter>
  );
}
