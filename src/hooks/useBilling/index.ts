import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';

import {
  PlanIds,
  ProductsUsageAndLimits,
  SubscriptionChangeOption,
} from '@/app/(portal)/(billing)/billing/types';
import { APP_BASE_URL } from '@/constants';
import { queryClient } from '@/libs';
import { portalApi } from '@/utils';

const cancelUrl = `${APP_BASE_URL}/billing`;

interface StripeSession {
  url: string;
}

export const BillingService = {
  createSubscription: (planId: PlanIds): Promise<StripeSession | void> =>
    portalApi.post('/v2/billing/subscriptions', {
      planId,
      cancelUrl,
      successUrl: `${APP_BASE_URL}/payment/success`,
    }),
  updateSubscription: (planId: PlanIds): Promise<StripeSession | void> =>
    portalApi.patch('/v2/billing/subscriptions', {
      planId,
      changeOption: SubscriptionChangeOption.IMMEDIATE,
      cancelUrl,
      successUrl: `${APP_BASE_URL}/payment/success`,
    }),
  getBillingPortal: (): Promise<StripeSession> =>
    portalApi.post('/v2/billing/stripe/billing-portal', {
      returnUrl: `${APP_BASE_URL}/payment/update/success`,
    }),
  cancelSubscription: (): Promise<void> =>
    portalApi.post('/v2/billing/subscriptions/cancel'),
  fetchQuotas: (): Promise<ProductsUsageAndLimits> =>
    portalApi.get('/v2/billing/quotas'),
};

export const useCreateSubscriptionMutation = () =>
  useMutation({
    mutationKey: ['billingPaymentSession'],
    mutationFn: BillingService.createSubscription,
  });

export const useUserQuotasQuery = (
  options?: Omit<
    UseQueryOptions<ProductsUsageAndLimits>,
    'queryKey' | 'queryFn'
  >,
) =>
  useQuery({
    queryKey: ['user', 'quotas'],
    queryFn: BillingService.fetchQuotas,
    refetchInterval: 1000 * 60,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    ...options,
  });

const scheduleUserRefetch = () => {
  setTimeout(() => queryClient.refetchQueries({ queryKey: ['user'] }), 5000);
  setTimeout(() => queryClient.refetchQueries({ queryKey: ['user'] }), 10000);
};

export const useUpdateSubscriptionMutation = ({
  onMutate,
  ...options
}: UseMutationOptions<StripeSession | void, Error, PlanIds> = {}) =>
  useMutation({
    mutationFn: BillingService.updateSubscription,
    onMutate: (...args) => {
      scheduleUserRefetch();
      onMutate?.(...args);
    },
    ...options,
  });

export const useStripeBillingPortalSessionMutation = () =>
  useMutation({
    mutationFn: BillingService.getBillingPortal,
  });

export const useCancelSubscriptionMutation = ({
  onSettled,
  ...options
}: UseMutationOptions<void, Error> = {}) =>
  useMutation({
    mutationFn: BillingService.cancelSubscription,
    onSettled: (...args) => {
      scheduleUserRefetch();
      onSettled?.(...args);
    },
    ...options,
  });
