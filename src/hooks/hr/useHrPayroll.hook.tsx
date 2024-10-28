import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  getPayrollStatistics,
  PayrollRecordParams,
} from '@/services/hr/hr-payroll.service';

import { UseQueryConfig } from '@/types';
import { PayrollRecordApiResponse } from '@/types/hr-payroll.types';

export const usePayrollStatisticsQuery = (
  params: PayrollRecordParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['payrollStats', params],
    queryFn: () => getPayrollStatistics(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<PayrollRecordApiResponse, Error>;
