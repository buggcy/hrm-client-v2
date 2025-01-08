import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  PayrollV2Params,
  postPayout,
} from '@/services/employee/employeePayroll.service';

import { UseQueryConfig } from '@/types';
import { EmployeePayrollApiResponse } from '@/types/employeePayroll.types';

export const usePayrollQuery = (
  params: PayrollV2Params,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['employeePayroll', params],
    queryFn: () => postPayout(params),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<EmployeePayrollApiResponse, Error>;
