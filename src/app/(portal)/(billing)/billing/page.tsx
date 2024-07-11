'use client';

import React from 'react';
import Link from 'next/link';

import { AxiosError } from 'axios';
import { CheckIcon, XIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button, ButtonProps } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';

import { useUserQuery } from '@/hooks';
import {
  useCancelSubscriptionMutation,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
} from '@/hooks/useBilling';

import { getPlanPrefixId, PlanIds, PlanPrefixIds } from './types';

const PlanPrefixIdsLevels = {
  [PlanPrefixIds.STARTER]: 1,
  [PlanPrefixIds.HOBBYIST]: 2,
  [PlanPrefixIds.BUSINESS]: 3,
  [PlanPrefixIds.CUSTOM]: 4,
  [PlanPrefixIds.ENTERPRISE]: 4,
};

interface PlanCardProps {
  badge?: React.ReactNode;
  buttonProps: ButtonProps & {
    children: React.ReactNode;
    href?: string;
    target?: string;
    isLoading?: boolean;
  };
  isSelected?: boolean;
  item: {
    id: PlanIds;
    price: React.ReactNode;
    title: React.ReactNode;
    subTitle: React.ReactNode;
    includes: React.ReactNode[];
    excludes?: React.ReactNode[];
  };
}

const PlanCard: React.FC<PlanCardProps> = ({
  badge,
  buttonProps,
  isSelected,
  item,
}) => (
  <Card
    className={`flex min-w-[270px] max-w-[400px] flex-col ${isSelected ? 'border-[#F562BF] bg-[#FEF7FC]' : 'border-[#DDDEE3] bg-white'}`}
  >
    <CardHeader>
      <CardTitle className="flex items-center text-xl font-bold">
        {item.title}
        {badge && (
          <Badge
            variant="secondary"
            className="ml-3 bg-[rgba(242,48,170,0.18)] text-[#F230AA]"
          >
            {badge}
          </Badge>
        )}
      </CardTitle>
      <p className="text-sm text-[#6F7897]">{item.subTitle}</p>
    </CardHeader>
    <CardContent>
      <div className="mb-5 flex items-end gap-1.5">
        {typeof item.price === 'string' ? (
          <>
            <span className="text-5xl font-bold">{item.price}</span>
            <span className="whitespace-nowrap text-sm text-[#6F7897]">
              / month
            </span>
          </>
        ) : (
          item.price
        )}
      </div>
      <Separator className="my-5" />
      <ul className="space-y-2.5">
        {item.includes.map((includeItem, index) => (
          <li key={index} className="flex items-start">
            <CheckIcon className="mr-3 size-5 shrink-0" />
            <span>{includeItem}</span>
          </li>
        ))}
        {item.excludes &&
          item.excludes.map((exclude, index) => (
            <li key={index} className="flex items-start text-gray-500">
              <XIcon className="mr-3 size-5 shrink-0" />
              <span>{exclude}</span>
            </li>
          ))}
      </ul>
    </CardContent>
    <CardFooter className="mt-auto">
      <Button
        className="w-full"
        variant={isSelected ? 'default' : 'outline'}
        id={item.id}
        asChild={!!buttonProps.href}
        disabled={buttonProps.isLoading}
        {...buttonProps}
      >
        {buttonProps.isLoading ? (
          'Loading...'
        ) : buttonProps.href ? (
          <Link target={buttonProps.target} href={buttonProps.href}>
            {buttonProps.children}
          </Link>
        ) : (
          buttonProps.children
        )}
      </Button>
    </CardFooter>
  </Card>
);

const CardsList: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ul className="mb-20 flex flex-wrap justify-evenly gap-6">{children}</ul>
);

const PlanItemsConfig: Record<
  Exclude<PlanPrefixIds, PlanPrefixIds.ENTERPRISE>,
  PlanCardProps['item']
> = {
  [PlanPrefixIds.STARTER]: {
    id: PlanIds[PlanPrefixIds.STARTER],
    price: '$1',
    title: 'Starter',
    subTitle: 'Quick test our APIs',
    includes: [
      'AI Video Generation',
      <React.Fragment key="tokens">
        <b>300</b>&nbsp;tokens per month
      </React.Fragment>,
      'Access to Stock Replicas',
      'Multilingual',
      'API Access',
    ],
    excludes: ['No Overage', 'No Personal Replicas'],
  },
  [PlanPrefixIds.HOBBYIST]: {
    id: PlanIds[PlanPrefixIds.HOBBYIST],
    price: '$39',
    title: 'Hobbyist',
    subTitle: 'Casually explore our APIs',
    includes: [
      'Everything in Starter',
      <React.Fragment key="tokens">
        <b>2,500</b>&nbsp;tokens per month
      </React.Fragment>,
      '$20 per 1,000 more tokens',
      '3 Personal Replicas included',
    ],
  },
  [PlanPrefixIds.BUSINESS]: {
    id: PlanIds[PlanPrefixIds.BUSINESS],
    price: '$199',
    title: 'Business',
    subTitle: 'Add APIs to your app',
    includes: [
      'Everything in Hobbyist',
      <React.Fragment key="tokens">
        <b>15,000</b>&nbsp;tokens per month
      </React.Fragment>,
      '$16 per 1,000 more tokens',
      '7 Personal Replicas included',
    ],
  },
  [PlanPrefixIds.CUSTOM]: {
    id: PlanIds[PlanPrefixIds.CUSTOM],
    price: <span className="text-5xl font-bold">{"Let's talk!"}</span>,
    title: 'Enterprise',
    subTitle: 'Scale AI videos',
    includes: [
      'Custom pricing and discounts',
      'Faster GPU processing',
      'Priority access to new models',
      'Analytics & Reporting',
      'Dedicated Enterprise Support',
    ],
  },
};

const ENTERPRISE_BUTTON_PROPS: PlanCardProps['buttonProps'] = {
  target: '_blank',
  children: 'Contact Sales',
  href: 'https://calendly.com/d/3r3-8kw-b9x',
};

const BillingPlansCardsList: React.FC = () => {
  const { isPending, mutateAsync } = useCreateSubscriptionMutation();

  const handleSubmit = async (planId: PlanIds) => {
    try {
      const session = await mutateAsync(planId);
      window.location.href = session.url;
    } catch (_e) {
      const e = _e as AxiosError;
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          e.response?.status === 409
            ? 'You already have an active subscription. Please cancel it before purchasing a new one.'
            : 'Oh no! Something went wrong. Please try again later. If the problem persists, contact support.',
      });
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    handleSubmit(event.currentTarget.id as PlanIds);

  const buttonProps: PlanCardProps['buttonProps'] = {
    isLoading: isPending,
    onClick: handleClick,
    children: 'Get Started',
  };

  return (
    <CardsList>
      <PlanCard
        buttonProps={buttonProps}
        item={PlanItemsConfig[PlanPrefixIds.STARTER]}
      />
      <PlanCard
        buttonProps={buttonProps}
        item={PlanItemsConfig[PlanPrefixIds.HOBBYIST]}
      />
      <PlanCard
        isSelected
        badge={
          <Badge
            variant="secondary"
            className="ml-3 bg-[rgba(242,48,170,0.18)] text-[#F230AA]"
          >
            RECOMMENDED
          </Badge>
        }
        buttonProps={buttonProps}
        item={PlanItemsConfig[PlanPrefixIds.BUSINESS]}
      />
      <PlanCard
        buttonProps={ENTERPRISE_BUTTON_PROPS}
        item={PlanItemsConfig[PlanPrefixIds.CUSTOM]}
      />
    </CardsList>
  );
};

const PLANS = [
  PlanPrefixIds.STARTER,
  PlanPrefixIds.HOBBYIST,
  PlanPrefixIds.BUSINESS,
  PlanPrefixIds.CUSTOM,
] as const;

const UpdateBillingPlansList: React.FC = () => {
  const { data: user, isLoading } = useUserQuery();
  const { isPending, mutate } = useUpdateSubscriptionMutation({
    onMutate: () => {
      toast({
        title: 'Processing',
        description: 'We are updating your subscription. Please wait. 🚀',
      });
    },
  });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    mutate(event.currentTarget.id as PlanIds);
  };

  const currentPlanPrefixId = getPlanPrefixId(
    user?.billingAccount?.plan_id ?? '',
  );

  const getUpgradePlanProps = (planPrefixId: PlanPrefixIds) => ({
    buttonProps:
      planPrefixId === PlanPrefixIds.CUSTOM
        ? ENTERPRISE_BUTTON_PROPS
        : ({
            isLoading: isPending || isLoading,
            onClick: handleClick,
            children: 'Upgrade',
          } as ButtonProps & { children: React.ReactNode }),
  });

  return (
    <CardsList>
      {PLANS.map(planPrefixId => {
        let props: Partial<PlanCardProps>;
        if (planPrefixId === currentPlanPrefixId) {
          props = {
            isSelected: true,
            badge: (
              <Badge
                variant="secondary"
                className="ml-3 bg-[rgba(242,48,170,0.18)] text-[#F230AA]"
              >
                YOUR PLAN
              </Badge>
            ),
            buttonProps: { disabled: true, children: 'Current' },
          };
        } else if (
          PlanPrefixIdsLevels[planPrefixId] <
          PlanPrefixIdsLevels[currentPlanPrefixId]
        ) {
          props = { buttonProps: { disabled: true, children: '-' } };
        } else {
          props = getUpgradePlanProps(planPrefixId);
        }

        return (
          <PlanCard
            /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
            // @ts-expect-error
            item={PlanItemsConfig[planPrefixId]}
            key={planPrefixId}
            {...(props as PlanCardProps)}
          />
        );
      })}
    </CardsList>
  );
};

export default function BillingPlansPage() {
  const { data: user, isLoading } = useUserQuery();
  const { mutate } = useCancelSubscriptionMutation({
    onSuccess: () => {
      toast({
        title: 'Success',
        description:
          'We are processing your cancellation request. Your subscription will be terminated shortly.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          'Oh no! Something went wrong. Please try again later. If the problem persists, contact support.',
      });
    },
  });

  const hasActiveSubscription = user?.billingAccount?.status === 'active';

  if (isLoading) return null;

  return (
    <div className="flex flex-col gap-10">
      {hasActiveSubscription ? (
        <UpdateBillingPlansList />
      ) : (
        <BillingPlansCardsList />
      )}
      {/*TODO: clarify are u sure*/}
      {hasActiveSubscription && (
        <Button variant="destructive" onClick={() => mutate()}>
          Cancel Subscription
        </Button>
      )}
    </div>
  );
}
