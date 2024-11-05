import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { HrDashboardStatsApiResponse } from '@/libs/validations/hr-dashboard';
import { getDashboardStats } from '@/services/hr/dashboard-list.service';

import { UseQueryConfig } from '@/types';

export const useHrDashboardStatsQuery = (config: UseQueryConfig = {}) =>
  useQuery({
    queryKey: ['hrDashboardStats'],
    queryFn: () => getDashboardStats(),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<HrDashboardStatsApiResponse, Error>;
