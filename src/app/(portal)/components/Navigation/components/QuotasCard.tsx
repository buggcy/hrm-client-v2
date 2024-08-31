import Link from 'next/link';

import { Clapperboard, MonitorDot, UserIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

import {
  DeveloperPlanIds,
  isEnterprise,
  UsageAndLimits,
} from '@/app/(portal)/(billing)/billing/types';
import { useUserQuery } from '@/hooks';
import { useUserQuotasQuery } from '@/hooks/useBilling';
import { cn } from '@/utils';

import { BillingAccountStatus } from '@/types';

const INFINITY_QUOTAS_VALUE = 99999999;

export default function QuotasCard({ className }: { className?: string }) {
  const { data: user } = useUserQuery();

  if (
    !user ||
    ((user?.billingAccount?.plan_id === DeveloperPlanIds.GROWTH ||
      user?.billingAccount?.plan_id === DeveloperPlanIds.STARTER ||
      isEnterprise(user)) &&
      user?.billingAccount?.status === BillingAccountStatus.ACTIVE)
  )
    return null;

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

const QuotaItem = ({
  isLoading,
  data,
  Icon,
  measure = 'quotas',
  noQuotasText = 'No quotas available',
}: {
  isLoading: boolean;
  data?: UsageAndLimits;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  measure: string;
  noQuotasText?: string;
}) => (
  <div className="space-y-1.5">
    <div className="flex items-center gap-2">
      <Icon className="size-5 text-muted-foreground" />
      <span className="text-xs font-medium text-muted-foreground">
        {isLoading
          ? 'Loading...'
          : data?.usageLimit
            ? data.usageLimit === INFINITY_QUOTAS_VALUE
              ? data.currentUsage + ` ${measure} used`
              : `${data.currentUsage}/${data.usageLimit} ${measure} used`
            : noQuotasText}
      </span>
    </div>
    <Progress
      value={data?.usageLimit && (data?.currentUsage / data?.usageLimit) * 100}
      className="h-1 w-full"
      variant="white"
    />
  </div>
);

export const UsageProgress = () => {
  const { data: quotas, isLoading } = useUserQuotasQuery();

  return (
    <div className="space-y-4 p-0">
      <QuotaItem
        isLoading={isLoading}
        data={quotas?.video}
        Icon={Clapperboard}
        measure="video generation minutes"
        noQuotasText="No minutes available"
      />
      <QuotaItem
        isLoading={isLoading}
        Icon={MonitorDot}
        measure={'conversation minutes'}
        noQuotasText={'No conversation minutes available'}
        data={quotas?.conversation}
      />
      <QuotaItem
        isLoading={isLoading}
        data={quotas?.replica}
        Icon={UserIcon}
        measure="replicas"
        noQuotasText="No personal replicas available"
      />
    </div>
  );
};
