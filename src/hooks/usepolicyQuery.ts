import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import {
  PolicyApiResponse,
  PolicyQueryParamsType,
} from '../libs/validations/hr-policy';
import { policyService } from '../services/hr/policies.service';

export const useFetchPolicies = (type: string) => {
  return useQuery<PolicyApiResponse, Error>({
    queryKey: ['policies', type],
    queryFn: () => policyService.fetchPolicies(type),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5,
  });
};

export const useFetchAllPolicies = (params: PolicyQueryParamsType) => {
  return useQuery<PolicyApiResponse, Error>({
    queryKey: ['allPolicies', params],
    queryFn: () => policyService.fetchAllPolicies(params),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5,
  });
};

export const useFetchAllCategories = (config = {}) => {
  return useQuery<AxiosResponse, Error>({
    queryKey: ['categories'],
    queryFn: policyService.fetchAllCategories,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<{ message: string; categories: string[] }, Error>;
};
