import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { HrDashboardStatsApiResponse } from '@/libs/validations/hr-dashboard';
import {
  dashboardParams,
  getDashboardStats,
} from '@/services/hr/dashboard-list.service';

import { UseQueryConfig } from '@/types';

export const useHrDashboardStatsQuery = (
  params: dashboardParams,
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
