import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import {
  PolicyApiResponse,
  PolicyQueryParamsType,
} from '../libs/validations/hr-policy';
import { policyService } from '../services/hr/policies.service';

type SuccessMessageResponse = {
  message: string;
};

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

export const useDeletePolicy = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: policyService.deletePolicy,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['policies'] });
      void queryClient.invalidateQueries({ queryKey: ['allPolicies'] });
    },
  });
};

export const useAddPolicy = () => {
  const queryClient = useQueryClient();

  return useMutation<SuccessMessageResponse, Error, FormData>({
    mutationFn: policyService.addPolicy,
    onSuccess: data => {
      // Capture the data from the successful response
      console.log('Success data:', data); // Log the success data if needed
      void queryClient.invalidateQueries({ queryKey: ['policies'] });
      void queryClient.invalidateQueries({ queryKey: ['allPolicies'] });
    },
    onError: error => {
      console.error('Error:', error); // Handle error if needed
    },
  });
};
