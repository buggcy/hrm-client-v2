import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { PolicyListParams,getPolicyList } from '@/services/employee/policy.service';

import { UseQueryConfig } from '@/types';
import { PolicyApiResponse } from '@/types/policies.types';

export const usePolicyListQuery = (
  params: PolicyListParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['policyList', params],
    queryFn: () => getPolicyList(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<PolicyApiResponse, Error>;
