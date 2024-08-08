import { BillingAccountStatus, IUser } from '@/types';

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

export const DeveloperPlanIds = {
  FREE: 'free_dev',
  PAY_AS_U_GO: 'pay_as_you_go_dev',
  ADVANCED: 'advanced_dev',
} as const;
export type DeveloperPlanIds =
  (typeof DeveloperPlanIds)[keyof typeof DeveloperPlanIds];
export const DeveloperPlanIdsSet = new Set<string>(
  Object.values(DeveloperPlanIds),
);

export type PlanIds = DeveloperPlanIds | `${PlanPrefixIds}_${string}`;

export const getPlanPrefix = (planId?: PlanIds) => planId?.split('_')?.[0];

export const isEnterprise = (user?: IUser): boolean =>
  !!user &&
  user?.billingAccount?.status === BillingAccountStatus.ACTIVE &&
  getPlanPrefix(user?.billingAccount?.plan_id as PlanIds) ===
    PlanPrefixIds.ENTERPRISE;
export const hasCustomPlan = (user?: IUser): boolean =>
  !!user &&
  !isEnterprise(user) &&
  user?.billingAccount?.status === BillingAccountStatus.ACTIVE &&
  !DeveloperPlanIdsSet.has(user?.billingAccount?.plan_id as string);

export enum SubscriptionChangeOption {
  END_OF_SUB_TERM = 'end_of_subscription_term',
  IMMEDIATE = 'immediate',
  REQUESTED_DATE = 'requested_date',
}
