import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { getAllPolicies, PolicyParams } from '@/services/hr/policies.service';

import { UseQueryConfig } from '@/types';
import { PolicyApiResponse } from '@/types/hr-policies.types';

export const usePolicyQuery = (
  params: PolicyParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['getPolicy', params],
    queryFn: () => getAllPolicies(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<PolicyApiResponse, Error>;
