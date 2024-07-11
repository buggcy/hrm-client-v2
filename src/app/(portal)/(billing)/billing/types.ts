import { IUser, UserRole } from '@/types';

export enum PlanPrefixIds {
  STARTER = 'starter',
  HOBBYIST = 'hobbyist',
  BUSINESS = 'business',
  CUSTOM = 'custom',
  ENTERPRISE = 'enterprise',
}

export enum BillingEventItem {
  REPLICA = 'replica',
  VIDEO = 'video',
  CONVERSATION = 'conversation',
}

export interface UsageAndLimits {
  currentUsage: number;
  usageLimit: number;
  planLimit: number;
  isAllowed: boolean;
}

export type ProductsUsageAndLimits = Record<BillingEventItem, UsageAndLimits>;

export const PlanIds: Record<PlanPrefixIds, `${PlanPrefixIds}_${string}`> = {
  [PlanPrefixIds.STARTER]: 'starter_v1',
  [PlanPrefixIds.HOBBYIST]: 'hobbyist_v1',
  [PlanPrefixIds.BUSINESS]: 'business_v1',
  [PlanPrefixIds.CUSTOM]: 'custom_v1',
  [PlanPrefixIds.ENTERPRISE]: 'enterprise_v1',
} as const;
export type PlanIds = (typeof PlanIds)[keyof typeof PlanIds];

export const getPlanPrefixId = (planId: string): PlanPrefixIds => {
  const prefix = planId?.split('_')?.[0];

  return PlanIds[prefix as PlanPrefixIds]
    ? (prefix as PlanPrefixIds)
    : PlanPrefixIds.CUSTOM;
};

export const isEnterprisePlan = (user: IUser): boolean =>
  user?.role !== UserRole.DEVELOPER ||
  (user?.billingAccount?.status === 'active' &&
    getPlanPrefixId(user?.billingAccount?.plan_id as PlanIds) ===
      PlanPrefixIds.ENTERPRISE);

export enum SubscriptionChangeOption {
  END_OF_SUB_TERM = 'end_of_subscription_term',
  IMMEDIATE = 'immediate',
  REQUESTED_DATE = 'requested_date',
}
