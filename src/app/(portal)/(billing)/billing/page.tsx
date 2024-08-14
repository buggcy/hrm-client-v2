'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { AxiosError } from 'axios';
import { format } from 'date-fns';
import { ArrowUpRight, CheckIcon, TriangleAlert, XIcon } from 'lucide-react';

import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { LoadingButton } from '@/components/LoadingButton';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonProps } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';

import { ChangePaymentMethodButton } from '@/app/(portal)/(billing)/payment/cancel/components/ChangePaymentMethodButton';
import { UsageProgress } from '@/app/(portal)/components/Navigation/components/QuotasCard';
import { useUserQuery } from '@/hooks';
import {
  useCancelSubscriptionMutation,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
} from '@/hooks/useBilling';

import {
  DeveloperPlanIds,
  DeveloperPlanIdsSet,
  hasCustomPlan,
  isEnterprise,
  PlanIds,
  PlanPrefixIds,
} from './types';

import { BillingAccountStatus } from '@/types';

const PlanPrefixIdsLevels = {
  [DeveloperPlanIds.FREE]: 1,
  [DeveloperPlanIds.STARTER]: 2,
  [DeveloperPlanIds.GROWTH]: 3,
} as const;

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
  badge = 'YOUR PLAN',
  buttonProps,
  isSelected,
  item,
}) => (
  <Card
    className={`flex min-w-[270px] max-w-[420px] flex-1 flex-col ${isSelected ? 'border-primary bg-primary/10' : 'border-border'}`}
  >
    <CardHeader>
      <CardTitle className="flex items-center text-xl font-bold">
        {item.title}
        {isSelected && (
          <Badge
            variant="secondary"
            className="ml-3 !bg-primary/10 text-primary"
          >
            {badge}
          </Badge>
        )}
      </CardTitle>
      <p className="text-sm">{item.subTitle}</p>
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
  <div>
    <div className="mb-4">
      <h1 className="text-2xl font-bold">All Plans</h1>
      <Button
        variant="link"
        asChild
        className="h-auto p-0 text-muted-foreground"
      >
        <a
          target="_blank"
          href="https://www.tavus.io/developer#pricing"
          className="flex items-center !gap-1 text-sm"
        >
          Learn more about packages and features
          <ArrowUpRight className="size-4" />
        </a>
      </Button>
    </div>
    <ul className="flex flex-wrap justify-around gap-6">{children}</ul>
  </div>
);

const PlanItemsConfig: Record<
  DeveloperPlanIds | PlanPrefixIds.CUSTOM | PlanPrefixIds.ENTERPRISE,
  PlanCardProps['item']
> = {
  [DeveloperPlanIds.FREE]: {
    id: DeveloperPlanIds.FREE,
    price: '$0',
    title: 'Free',
    subTitle: 'Get your feet wet',
    includes: [
      'Access to Conversational Video & Video Generation',
      'API access',
      '30+ languages (Video Generation)',
      // '5 Stock Replicas',
      '3 mins free credit (Video Generation)',
      '3 minute free credit (Conversational Video)',
    ],
    excludes: ['No personal replicas', 'No overage'],
  },
  [DeveloperPlanIds.STARTER]: {
    id: DeveloperPlanIds.STARTER,
    price: '$39',
    title: 'Starter',
    subTitle: 'Starting to build with AI video',
    includes: [
      'Everything in Free',
      '3 free personal replicas',
      '25 new personal replicas per month maximum',
      'Up to 5 concurrent conversations',
      'Content Moderation',
      'Bring your own audio',
    ],
  },
  [DeveloperPlanIds.GROWTH]: {
    id: DeveloperPlanIds.GROWTH,
    price: '$375',
    title: 'Growth',
    subTitle: 'Scaling AI video in your app',
    includes: [
      'Everything in Starter',
      '10 free personal replicas',
      '100 new personal replicas per month maximum',
      'Up to 25 concurrent conversations',
      'Conversation recording & transcripts',
      'Discounted pay as you go rates',
    ],
  },
  [PlanPrefixIds.ENTERPRISE]: {
    id: `${PlanPrefixIds.ENTERPRISE}_enterprise`,
    price: <span className="text-5xl font-bold">{"Let's talk!"}</span>,
    title: 'Enterprise',
    subTitle: 'For high volume and enterprise needs',
    includes: [
      'Custom pricing and discounts',
      'Unlimited personal replicas per month',
      'Custom concurrent sessions',
      'Whitelabeled consent clause',
      'Priority GPUs',
      'Premium Conversational Replicas',
      'Dedicated support',
    ],
  },
  [PlanPrefixIds.CUSTOM]: {
    id: `${PlanPrefixIds.CUSTOM}_custom`,
    price: <span className="text-5xl font-bold">{"Let's talk!"}</span>,
    title: 'Custom',
    subTitle: 'Legacy or trial plans',
    includes: [
      "You're on a custom plan. To upgrade or change your plan, please select a plan or contact your Tavus point of contact",
    ],
  },
};

const PlansBadges = {
  [DeveloperPlanIds.FREE]: 'Free',
  [DeveloperPlanIds.STARTER]: 'Starter',
  [DeveloperPlanIds.GROWTH]: 'Growth',
};

const ENTERPRISE_BUTTON_PROPS: PlanCardProps['buttonProps'] = {
  target: '_blank',
  children: 'Contact Sales',
  href: 'https://calendly.com/d/3r3-8kw-b9x',
};

const ActivePlanCard = () => {
  const { data: user } = useUserQuery();

  return (
    <Card className="mx-auto w-full p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Current Plan</h2>
          <Badge variant="secondary" className="!bg-primary/10 text-primary">
            {PlansBadges[user?.billingAccount?.plan_id as DeveloperPlanIds] ||
              'Custom'}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <CancelSubscription />
          <ChangePaymentMethodButton>
            Manage Payment Method
          </ChangePaymentMethodButton>
        </div>
      </div>
      <hr className="my-4" />
      <div>
        <h3 className="mb-4 font-semibold">Billing Cycle Usage</h3>
        <UsageProgress />
      </div>
    </Card>
  );
};

const BillingPlansCardsList: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: user } = useUserQuery();
  const { isPending, mutateAsync } = useCreateSubscriptionMutation();

  const handleSubmit = async (planId: PlanIds) => {
    if (isPending || user?.billingAccount?.plan_id === planId) return;

    try {
      const session = await mutateAsync(planId);

      if (session) window.location.href = session.url;
      else {
        router.push('/payment/success');
      }
    } catch (_e) {
      const e = _e as AxiosError;
      toast({
        variant: 'error',
        title: 'Error',
        description:
          e.response?.status === 409
            ? 'You already have an active subscription. Please cancel it before purchasing a new one.'
            : 'Oh no! Something went wrong. Please try again later. If the problem persists, contact support.',
      });
    }
  };

  useEffect(() => {
    const planId = searchParams.get('plan');

    if (planId) {
      router.push(pathname);

      if (!DeveloperPlanIdsSet.has(planId)) return;

      void handleSubmit(planId as PlanIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    handleSubmit(event.currentTarget.id as PlanIds);

  const buttonProps: PlanCardProps['buttonProps'] = {
    isLoading: isPending,
    onClick: handleClick,
    children: 'Get Started',
    disabled: isPending,
  };

  return (
    <CardsList>
      <PlanCard
        buttonProps={buttonProps}
        item={PlanItemsConfig[DeveloperPlanIds.FREE]}
      />
      <PlanCard
        isSelected
        badge="Recommended"
        buttonProps={buttonProps}
        item={PlanItemsConfig[DeveloperPlanIds.STARTER]}
      />
      <PlanCard
        buttonProps={buttonProps}
        item={PlanItemsConfig[DeveloperPlanIds.GROWTH]}
      />
      <PlanCard
        buttonProps={ENTERPRISE_BUTTON_PROPS}
        item={PlanItemsConfig[PlanPrefixIds.ENTERPRISE]}
      />
    </CardsList>
  );
};

const PLANS = [
  DeveloperPlanIds.FREE,
  DeveloperPlanIds.STARTER,
  DeveloperPlanIds.GROWTH,
] as const;

const UpdateBillingPlansList: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: user, isLoading } = useUserQuery();
  const { isPending, mutateAsync } = useUpdateSubscriptionMutation();

  const update = async (planId: PlanIds) => {
    if (isPending || user?.billingAccount?.plan_id === planId) return;

    try {
      const result = await mutateAsync(planId);

      if (result) {
        window.location.href = result.url;
      } else {
        toast({
          title: 'Processing',
          description: 'We are updating your subscription. Please wait. 🚀',
          variant: 'progress',
        });
      }
    } catch (e) {
      console.error(e);
      toast({
        variant: 'error',
        title: 'Error',
        description:
          'Oh no! Something went wrong. Please try again later. If the problem persists, contact support.',
      });
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    void update(event.currentTarget.id as PlanIds);
  };

  useEffect(() => {
    const planId = searchParams.get('plan');

    if (planId) {
      router.push(pathname);

      if (!DeveloperPlanIdsSet.has(planId)) return;

      void update(planId as PlanIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const isPaymentFailed =
    user?.billingAccount?.status === BillingAccountStatus.PAYMENT_FAILED;
  const userPlanId = user?.billingAccount?.plan_id as string;
  const isEnterprisePlan = isEnterprise(user);
  const isCustomPlan = hasCustomPlan(user);

  return (
    <CardsList>
      {PLANS.map(planId => {
        let props: Partial<PlanCardProps>;

        if (planId === userPlanId) {
          props = {
            isSelected: true,
            buttonProps: { disabled: true, children: 'Current Plan' },
          };
        } else if (
          !isCustomPlan &&
          (isEnterprisePlan ||
            PlanPrefixIdsLevels[planId as DeveloperPlanIds] <
              PlanPrefixIdsLevels[userPlanId as DeveloperPlanIds])
        ) {
          props = { buttonProps: { disabled: true, children: '-' } };
        } else {
          props = {
            buttonProps: {
              disabled: isPaymentFailed || isPending || isLoading,
              isLoading: isPending || isLoading,
              onClick: handleClick,
              children: 'Upgrade',
            },
          };
        }

        return (
          <PlanCard
            // @ts-ignore
            item={PlanItemsConfig[planId]}
            key={planId}
            {...(props as PlanCardProps)}
          />
        );
      })}
      {(isEnterprisePlan || !isCustomPlan) && (
        <PlanCard
          isSelected={isEnterprisePlan}
          item={PlanItemsConfig[PlanPrefixIds.ENTERPRISE]}
          buttonProps={ENTERPRISE_BUTTON_PROPS}
        />
      )}
      {isCustomPlan && (
        <PlanCard
          isSelected
          item={PlanItemsConfig[PlanPrefixIds.CUSTOM]}
          buttonProps={ENTERPRISE_BUTTON_PROPS}
        />
      )}
    </CardsList>
  );
};

const PaymentFailedBanner = () => {
  return (
    <div className="flex items-center justify-between rounded-md border bg-amber-100 p-4">
      <div className="flex items-center">
        <TriangleAlert className="mr-2 size-6 text-amber-600" />
        <span className="font-semibold text-amber-600">Payment Failed.</span>
        <span className="ml-2 text-amber-600">
          Please update your card details to continue using our services.
        </span>
      </div>
      <ChangePaymentMethodButton
        variant="outline"
        className="border-amber-600 bg-amber-100 text-amber-600 hover:bg-amber-200 hover:text-amber-800"
      >
        Manage Payment Method
      </ChangePaymentMethodButton>
    </div>
  );
};

export default function BillingPlansPage() {
  const { data: user, isLoading } = useUserQuery();

  if (isLoading) return null;

  return (
    <Layout>
      <LayoutHeader title="Billing">
        <LayoutHeaderButtonsBlock>
          <Button className="ml-auto" variant="outline" asChild>
            <Link target="_blank" href="https://docs.tavusapi.com">
              Read Docs
            </Link>
          </Button>
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper>
        <div className="flex flex-col gap-10">
          {user?.billingAccount?.status ===
            BillingAccountStatus.PAYMENT_FAILED && <PaymentFailedBanner />}
          {user?.billingAccount?.status === BillingAccountStatus.ACTIVE && (
            <ActivePlanCard />
          )}
          {user?.billingAccount?.status === BillingAccountStatus.ACTIVE ||
          user?.billingAccount?.status ===
            BillingAccountStatus.PAYMENT_FAILED ? (
            <UpdateBillingPlansList />
          ) : (
            <BillingPlansCardsList />
          )}
        </div>
      </LayoutWrapper>
    </Layout>
  );
}

const CancelSubscription = () => {
  const { data: user } = useUserQuery();
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCancelSubscriptionMutation({
    onSuccess: () => {
      toast({
        variant: 'progress',
        title: 'Cancellation request has been submitted',
      });
      setOpen(false);
    },
    onError: () => {
      toast({
        variant: 'error',
        title: 'Error',
        description:
          'Oh no! Something went wrong. Please try again later. If the problem persists, contact support.',
      });
    },
  });

  const hasActiveSubscription =
    user?.billingAccount?.status === BillingAccountStatus.ACTIVE;

  if (
    user?.billingAccount?.plan_id === DeveloperPlanIds.FREE ||
    !hasActiveSubscription ||
    isEnterprise(user)
  )
    return null;

  if (user?.billingAccount?.scheduled_cancellation_date)
    return (
      <p className="text-sm text-gray-600">
        Your plan will change to{' '}
        <span className="font-semibold text-primary">Free Plan</span> on{' '}
        <span className="font-semibold">
          {format(
            user?.billingAccount?.scheduled_cancellation_date,
            'MMMM d, yyyy',
          )}
        </span>
      </p>
    );

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button variant="outline">Cancel Subscription</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-2 inline-flex items-center gap-2">
              We’re sorry to see you go
            </DialogTitle>
            <DialogDescription className="font-medium">
              After canceling your subscription, you will retain access to your
              generated videos, but you will lose access to key features.
            </DialogDescription>
          </DialogHeader>
          <DialogDescription className="font-medium">
            Your credits will remain active until the end of this billing cycle.
            <br />
            <b className="text-foreground">
              Payment and credit renewals will no longer occur.
            </b>
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Not Now</Button>
            </DialogClose>

            <LoadingButton
              variant="destructiveOutline"
              // @ts-ignore
              onClick={mutate}
              disabled={isPending}
              loading={isPending}
            >
              Confirm Cancellation
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
