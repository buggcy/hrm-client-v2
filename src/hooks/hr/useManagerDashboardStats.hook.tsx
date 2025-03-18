import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { ManagerDashboardStatsApiResponse } from '@/libs/validations/manager-dashboard';
import { EmployeeDashboardParams } from '@/services/employee/dashboard.service';
import { getManagerDashboardStats } from '@/services/hr/dashboard-list.service';

import { UseQueryConfig } from '@/types';
export const defaultParams: EmployeeDashboardParams = {
  from: '',
  to: '',
};

export const useManagerDashboardStatsQuery = (
  params: EmployeeDashboardParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['managerDashboardStats', params],
    queryFn: () => getManagerDashboardStats(params),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<ManagerDashboardStatsApiResponse, Error>;
