import { useQuery } from '@tanstack/react-query';

import {
  EmployeeDashboardParams,
  fetchMonthlyAttendanceChartData,
} from '@/services/employee/dashboard.service';

import { UseQueryConfig } from '@/types';

export const useAttendanceData = (
  taho_id: string | null,
  params: EmployeeDashboardParams,
  config: UseQueryConfig = {},
) => {
  return useQuery({
    queryKey: ['attendancesss', taho_id, params],
    queryFn: () =>
      fetchMonthlyAttendanceChartData(taho_id ? taho_id : '', params),
    enabled: !!taho_id,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  });
};
