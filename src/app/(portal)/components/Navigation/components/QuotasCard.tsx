import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardFooter } from '@/components/ui/card';

import { useUserQuery } from '@/hooks';
import { cn } from '@/utils';

import { BillingAccountStatus } from '@/types';

export default function QuotasCard({ className }: { className?: string }) {
  const { data: user } = useUserQuery();

  return (
    <Card
      className={cn(
        'flex w-52 flex-col gap-4 rounded-lg border-none bg-gradient-to-b from-[#E9F0F6] to-transparent p-4 shadow-none dark:from-[rgba(233,240,246,0.15)]',
        className,
      )}
    >
      <CardFooter className="p-0">
        <Button variant="outline" className="w-full bg-transparent" asChild>
          <Link href="/billing">
            {user?.billingAccount?.status === BillingAccountStatus.ACTIVE
              ? 'Upgrade Plan'
              : user?.billingAccount?.status ===
                  BillingAccountStatus.PAYMENT_FAILED
                ? 'Update payment method'
                : 'Buy Plan'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
