import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from '@tanstack/react-query';
import { AxiosRequestConfig } from 'axios';

// import {
//   PlanIds,
//   ProductsUsageAndLimits,
//   SubscriptionChangeOption,
// } from '@/app/(portal)/(billing)/billing/types';
import { APP_BASE_URL } from '@/constants';
import { queryClient } from '@/libs';
import { portalApi } from '@/utils';

import { UseQueryConfig } from '@/types';

const cancelUrl = `${APP_BASE_URL}/billing`;

interface StripeSession {
  url: string;
}

interface SubscriptionMutationDto {
  planId: PlanIds;
  coupon?: string;
}

export const BillingService = {
  createSubscription: ({
    planId,
    coupon,
  }: SubscriptionMutationDto): Promise<StripeSession | void> =>
    portalApi.post('/v2/billing/subscriptions', {
      coupon,
      planId,
      cancelUrl,
      successUrl: `${APP_BASE_URL}/payment/success`,
    }),
  updateSubscription: ({
    planId,
    coupon,
  }: SubscriptionMutationDto): Promise<StripeSession | void> =>
    portalApi.patch('/v2/billing/subscriptions', {
      planId,
      changeOption: SubscriptionChangeOption.IMMEDIATE,
      cancelUrl,
      successUrl: `${APP_BASE_URL}/payment/success`,
      coupon,
    }),
  getBillingPortal: (): Promise<StripeSession> =>
    portalApi.post('/v2/billing/stripe/billing-portal', {
      returnUrl: `${APP_BASE_URL}/billing`,
    }),
  cancelSubscription: (): Promise<void> =>
    portalApi.post('/v2/billing/subscriptions/cancel'),
  fetchQuotas: (config?: AxiosRequestConfig): Promise<ProductsUsageAndLimits> =>
    portalApi.get('/v2/billing/quotas', config),
};

export const useCreateSubscriptionMutation = () =>
  useMutation({
    mutationKey: ['billingPaymentSession'],
    mutationFn: BillingService.createSubscription,
  });

export const useUserQuotasQuery = (
  options?: UseQueryConfig<ProductsUsageAndLimits>,
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
}: UseMutationOptions<
  StripeSession | void,
  Error,
  SubscriptionMutationDto
> = {}) =>
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
