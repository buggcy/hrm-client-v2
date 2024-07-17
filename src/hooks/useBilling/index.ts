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

const successUrl = `${APP_BASE_URL}/payment/success`;
const cancelUrl = `${APP_BASE_URL}/payment/cancel`;

interface StripeSession {
  url: string;
}

export const BillingService = {
  createSubscription: (planId: PlanIds): Promise<StripeSession> =>
    portalApi.post('/v2/billing/subscriptions', {
      planId,
      cancelUrl,
      successUrl,
    }),
  updateSubscription: (planId: PlanIds): Promise<void> =>
    portalApi.patch('/v2/billing/subscriptions', {
      planId,
      changeOption: SubscriptionChangeOption.IMMEDIATE,
    }),
  createStripeCheckoutSession: (): Promise<string> =>
    portalApi.post('/v2/billing/v2/subscriptions/checkoutSession', {
      successUrl,
      cancelUrl,
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
    ...options,
  });

export const useUpdateSubscriptionMutation = ({
  onMutate,
  ...options
}: UseMutationOptions<void, Error, PlanIds> = {}) =>
  useMutation({
    mutationKey: ['billingPaymentSession'],
    mutationFn: BillingService.updateSubscription,
    onMutate: (...args) => {
      setTimeout(
        () => queryClient.refetchQueries({ queryKey: ['user'] }),
        5000,
      );
      onMutate?.(...args);
    },
    ...options,
  });

export const useCreateStripeCheckoutSessionUrlMutation = () =>
  useMutation({
    mutationKey: ['billingPaymentSession'],
    mutationFn: BillingService.createStripeCheckoutSession,
  });

export const useCancelSubscriptionMutation = ({
  onSettled,
  ...options
}: UseMutationOptions<void, Error> = {}) =>
  useMutation({
    mutationKey: ['billingPaymentSession'],
    mutationFn: BillingService.cancelSubscription,
    onSettled: (...args) => {
      setTimeout(
        () => queryClient.refetchQueries({ queryKey: ['user'] }),
        5000,
      );
      onSettled?.(...args);
    },
    ...options,
  });
