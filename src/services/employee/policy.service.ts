import {
  policyApiResponseSchema,
  PolicyCategoryApiResponseSchema,
} from '@/libs/validations/policies';
import { baseAPI, schemaParse } from '@/utils';

import {
  PolicyApiResponse,
  PolicyCategoryApiResponse,
} from '@/types/policies.types';

export interface PolicyListParams {
  page?: number;
  limit?: number;
  category?: string;
}

export const getPolicyList = async (
  params: PolicyListParams = {},
): Promise<PolicyApiResponse> => {
  const defaultParams: PolicyListParams = {
    page: 1,
    limit: 5,
    category: '',
  };

  const mergedParams = { ...defaultParams, ...params };

  const queryParams = new URLSearchParams(
    Object.entries(mergedParams).reduce(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value.toString();
        }
        return acc;
      },
      {} as Record<string, string>,
    ),
  );

  try {
    const response = await baseAPI.get(`/policy-v2?${queryParams.toString()}`);
    return schemaParse(policyApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching employee list:', error);
    throw error;
  }
};
export const getCategoryList = async (): Promise<PolicyCategoryApiResponse> => {
  try {
    const response = await baseAPI.get('/policy/category');
    return schemaParse(PolicyCategoryApiResponseSchema)(response);
  } catch (error) {
    console.error('Error fetching policy categories:', error);
    throw error;
  }
};
