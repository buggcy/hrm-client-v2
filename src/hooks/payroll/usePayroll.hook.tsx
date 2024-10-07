import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  getPayrollList,
  PayrollListParams,
} from '@/services/employee/employeePayroll.service';

import { UseQueryConfig } from '@/types';
import { EmployeePayrollApiResponse } from '@/types/employeePayroll.types';

export const usePayrollQuery = (
  params: PayrollListParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['employeePayroll', params],
    queryFn: () => getPayrollList(params),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<EmployeePayrollApiResponse, Error>;
