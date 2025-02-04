import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { HrDashboardStatsApiResponse } from '@/libs/validations/hr-dashboard';
import { EmployeeDashboardParams } from '@/services/employee/dashboard.service';
import { getDashboardStats } from '@/services/hr/dashboard-list.service';

import { UseQueryConfig } from '@/types';
export const defaultParams: EmployeeDashboardParams = {
  from: '',
  to: '',
};

export const useHrDashboardStatsQuery = (
  params: EmployeeDashboardParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['hrDashboardStats', params],
    queryFn: () => getDashboardStats(params),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<HrDashboardStatsApiResponse, Error>;
