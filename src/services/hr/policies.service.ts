import { baseAPI, schemaParse } from '@/utils';

import { SuccessMessageResponse } from './employee.service';
import {
  PolicyApiResponse,
  policyApiResponseSchema,
  PolicyQueryParamsType,
} from '../../libs/validations/hr-policy';

export interface PolicyParams {
  page?: number;
  limit?: number;
  category?: string;
}

export const policyService = {
  fetchPolicies: async (type: string): Promise<PolicyApiResponse> => {
    const response = await baseAPI.get<PolicyApiResponse>(
      `/policy?category=${type}`,
    );
    console.log('fetchPolicies', response);
    return policyApiResponseSchema.parse(response.data);
  },

  fetchAllPolicies: async (
    params: PolicyQueryParamsType & { categories?: string[] },
  ): Promise<PolicyApiResponse> => {
    const { page, limit, category, categories } = params;
    let url = `/policy-v2?page=${page}&limit=${limit}`;

    if (category) {
      url += `&category=${category}`;
    }

    if (categories && categories.length > 0) {
      url += `&categories=${categories.join(',')}`;
    }

    const response = await baseAPI.get<PolicyApiResponse>(url);
    return policyApiResponseSchema.parse(response);
  },

  fetchAllCategories: async () => {
    const response = await baseAPI.get(`/policy/category`);
    return response;
  },
};

export const getAllPolicies = async (
  params: PolicyParams = {},
): Promise<PolicyApiResponse> => {
  const defaultParams: PolicyParams = {
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
    console.error('Error fetching policy list!', error);
    throw error;
  }
};

export const searchPolicy = async ({
  query,
  page,
  limit,
}: {
  query: string;
  page: number;
  limit: number;
}): Promise<PolicyApiResponse> => {
  const { data, pagination }: PolicyApiResponse = await baseAPI.get(
    `/search/policy?page=${page}&limit=${limit}&query=${query}`,
  );

  return { data, pagination };
};

export const deletePolicy = async (payload: {
  id: string;
}): Promise<SuccessMessageResponse> => {
  const { id } = payload;
  const { message }: SuccessMessageResponse = await baseAPI.delete(
    `/delete/policy/${id}`,
  );
  return { message };
};

export const addPolicy = async (payload: {
  formData: FormData;
}): Promise<SuccessMessageResponse> => {
  const { formData } = payload;
  const { message }: SuccessMessageResponse = await baseAPI.post(
    `/add/policy`,
    formData,
  );
  return { message };
};
