import { baseAPI } from '@/utils';

import {
  PolicyApiResponse,
  policyApiResponseSchema,
  PolicyQueryParamsType,
} from '../../libs/validations/hr-policy';

type SuccessMessageResponse = {
  message: string;
};
export const policyService = {
  fetchPolicies: async (type: string): Promise<PolicyApiResponse> => {
    const response = await baseAPI.get<PolicyApiResponse>(
      `/policy?category=${type}`,
    );
    console.log('fetchPolicies', response);
    return policyApiResponseSchema.parse(response.data);
  },

  fetchAllPolicies: async (
    params: PolicyQueryParamsType,
  ): Promise<PolicyApiResponse> => {
    const { page, limit, category } = params;
    const response = await baseAPI.get<PolicyApiResponse>(
      `/policyV2?page=${page}&limit=${limit}&category=${category}`,
    );
    return policyApiResponseSchema.parse(response);
  },

  fetchAllCategories: async () => {
    const response = await baseAPI.get(`/policy/category`);
    return response;
  },

  deletePolicy: async (id: string): Promise<{ message: string }> => {
    const response = await baseAPI.delete<{ message: string }>(
      `/delete/policy/${id}`,
    );
    return response.data;
  },

  addPolicy: async (formData: FormData): Promise<SuccessMessageResponse> => {
    const { message }: SuccessMessageResponse = await baseAPI.post(
      `/add/policy`,
      formData,
    );
    return { message };
  },
};
