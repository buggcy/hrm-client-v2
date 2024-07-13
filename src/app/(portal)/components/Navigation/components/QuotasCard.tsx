import Link from 'next/link';

import { Clapperboard, UserIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

import { isEnterprisePlan } from '@/app/(portal)/(billing)/billing/types';
import { useUserQuery } from '@/hooks';
import { useUserQuotasQuery } from '@/hooks/useBilling';
import { cn } from '@/utils';

const INFINITY_QUOTAS_VALUE = 99999999;

export default function QuotasCard({ className }: { className?: string }) {
  const { data: user } = useUserQuery();
  const { data: quotas, isLoading } = useUserQuotasQuery();

  const hasActiveBillingAccount = user?.billingAccount?.status === 'active';

  if (!user) return null;

  return (
    <Card
      className={cn(
        'flex w-52 flex-col gap-4 rounded-lg border-none bg-gradient-to-b from-[#E9F0F6] to-transparent p-4 shadow-none dark:from-[rgba(233,240,246,0.15)]',
        className,
      )}
    >
      {hasActiveBillingAccount && (
        <CardContent className="space-y-4 p-0">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Clapperboard className="size-5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                {isLoading
                  ? 'Loading...'
                  : quotas?.video.planLimit
                    ? quotas.video.planLimit === INFINITY_QUOTAS_VALUE
                      ? quotas.video.currentUsage + ' min used'
                      : `${quotas.video.currentUsage}/${quotas.video.planLimit} min left`
                    : 'No minutes available'}
              </span>
            </div>
            <Progress
              value={
                quotas?.video.planLimit &&
                (quotas?.video.currentUsage / quotas?.video.planLimit) * 100
              }
              className="h-1 w-full"
              variant="white"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <UserIcon className="size-5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                {isLoading
                  ? 'Loading...'
                  : quotas?.replica?.planLimit
                    ? (quotas.replica.planLimit === INFINITY_QUOTAS_VALUE
                        ? quotas.replica.currentUsage
                        : `${quotas.replica.currentUsage}/${quotas.replica.planLimit}`) +
                      ` replica used`
                    : 'No own replicas available'}
              </span>
            </div>
            <Progress
              value={
                quotas?.replica.planLimit &&
                (quotas?.replica.currentUsage / quotas?.replica.planLimit) * 100
              }
              className="h-1 w-full"
              variant="white"
            />
          </div>
        </CardContent>
      )}
      {!isEnterprisePlan(user) && (
        <CardFooter className="p-0">
          <Button variant="outline" className="w-full bg-transparent" asChild>
            <Link href="/billing">
              {hasActiveBillingAccount ? 'Upgrade Plan' : 'Buy Plan'}
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
