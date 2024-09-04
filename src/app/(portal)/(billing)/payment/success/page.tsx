'use client';

import { useEffect } from 'react';
import Link from 'next/link';

import { sendGTMEvent } from '@next/third-parties/google';
import { Query } from '@tanstack/react-query';
import { CheckIcon, Loader2 } from 'lucide-react';
import Confetti from 'react-confetti';

import { Button } from '@/components/ui/button';

import { LayoutCenter } from '@/app/(portal)/(billing)/components/Layout';
import { useUserQuery } from '@/hooks';
import { queryClient } from '@/libs';

import { BillingAccountStatus, IUser } from '@/types';

export default function Page() {
  const { data: user } = useUserQuery({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    refetchInterval(query: Query<IUser>) {
      if (
        query.state.data?.billingAccount?.status !== BillingAccountStatus.ACTIVE
      ) {
        return 3 * 1000;
      }
      return false;
    },
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (user?.billingAccount?.status === BillingAccountStatus.ACTIVE) {
      void queryClient.refetchQueries({ queryKey: ['user', 'quotas'] });
      sendGTMEvent({
        event: 'purchase',
        item: user.billingAccount.plan_id,
      });
    }
  }, [user]);

  return (
    <LayoutCenter className="flex-col">
      <Confetti recycle={false} numberOfPieces={600} />
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary-foreground">
        {user?.billingAccount?.status === BillingAccountStatus.ACTIVE ? (
          <CheckIcon className="size-6 text-primary" />
        ) : (
          <Loader2 className="size-6 animate-spin text-primary" />
        )}
      </div>
      <div className="flex w-full max-w-lg flex-col items-center justify-center text-center">
        <h1 className="mb-4 text-2xl font-bold">
          {user?.billingAccount?.status === BillingAccountStatus.ACTIVE
            ? 'Your subscription is active'
            : 'Your subscription is almost ready'}
        </h1>
        <p className="mb-6 text-sm font-medium text-muted-foreground">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          Thank you for subscribing!
          {user?.billingAccount?.status === BillingAccountStatus.ACTIVE
            ? ' You can now access all premium features.'
            : " We're putting the finishing touches on your account. You'll be able to access your new features in just a moment."}
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button asChild>
            <Link href="/">Get Started</Link>
          </Button>
        </div>
      </div>
    </LayoutCenter>
  );
}
