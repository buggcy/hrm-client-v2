'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { AxiosError } from 'axios';
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
import { useUserQuery } from '@/hooks';
import {
  useCancelSubscriptionMutation,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
} from '@/hooks/useBilling';

import { getPlanPrefixId, PlanIds, PlanPrefixIds } from './types';

import { BillingAccountStatus } from '@/types';

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
    className={`flex min-w-[270px] max-w-[350px] flex-1 flex-col ${isSelected ? 'border-primary bg-primary/10' : 'border-border'}`}
  >
    <CardHeader>
      <CardTitle className="flex items-center text-xl font-bold">
        {item.title}
        {badge && (
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
        <Link
          href="https://www.tavus.io/developer#pricing"
          className="flex items-center !gap-1 text-sm"
        >
          Learn more about packages and features
          <ArrowUpRight className="size-4" />
        </Link>
      </Button>
    </div>
    <ul className="flex flex-wrap justify-evenly gap-6">{children}</ul>
  </div>
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
  const { data: user } = useUserQuery();
  const { isPending, mutateAsync } = useCreateSubscriptionMutation();

  const handleSubmit = async (planId: PlanIds) => {
    try {
      const session = await mutateAsync(planId);
      window.location.href = session.url;
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

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    handleSubmit(event.currentTarget.id as PlanIds);

  const buttonProps: PlanCardProps['buttonProps'] = {
    isLoading: isPending,
    onClick: handleClick,
    children: 'Get Started',
    disabled:
      isPending ||
      user?.billingAccount?.status === BillingAccountStatus.PAYMENT_FAILED,
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
        badge="Recommended"
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
        variant: 'progress',
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
            badge: 'YOUR PLAN',
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

  const hasActiveSubscription =
    user?.billingAccount?.status === BillingAccountStatus.ACTIVE;

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
          {hasActiveSubscription ? (
            <UpdateBillingPlansList />
          ) : (
            <BillingPlansCardsList />
          )}
          <div className="rounded-md border bg-background p-6 shadow-sm">
            <div className="flex flex-col md:flex-row">
              <div className="flex-1">
                <h2 className="text-xl font-semibold">How do tokens work?</h2>
                <p className="mt-2 text-muted-foreground">
                  Each plan includes a set amount of tokens per month. You can
                  use those tokens to create replicas, or generate videos. Some
                  plans have Personal Replicas included already.
                </p>
              </div>
              <div className="mx-6 hidden border-l md:block" />
              <div className="mt-4 flex flex-1 flex-col items-center justify-evenly space-y-4 md:mt-0 md:flex-row md:space-x-8 md:space-y-0">
                <div>
                  <h3 className="font-semibold">Personal Replicas</h3>
                  <p className="text-muted-foreground">5000 tokens/Replica</p>
                </div>
                <div>
                  <h3 className="font-semibold">Text to video</h3>
                  <p className="text-muted-foreground">100 tokens/min</p>
                </div>
              </div>
            </div>
          </div>
          {hasActiveSubscription && <CancelButton />}
        </div>
      </LayoutWrapper>
    </Layout>
  );
}

const CancelButton = () => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const { mutate, isPending } = useCancelSubscriptionMutation({
    onSuccess: () => {
      router.push('/billing/cancel-plan');
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

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button variant="destructive">Cancel Subscription</Button>
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
