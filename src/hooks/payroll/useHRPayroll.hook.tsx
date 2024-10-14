import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { HRPayrollApiResponse } from '@/libs/validations/hr-payroll';
import {
  getPayrollList,
  HRPayrollListParams,
} from '@/services/hr/payroll.service';

import { UseQueryConfig } from '@/types';

export const useHRPayrollListQuery = (
  params: HRPayrollListParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['payroll', params],
    queryFn: () => getPayrollList(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<HRPayrollApiResponse, Error>;
