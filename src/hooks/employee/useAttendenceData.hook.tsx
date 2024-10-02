import { useQuery } from '@tanstack/react-query';

import { fetchMonthlyAttendanceChartData } from '@/services/employee/dashboard.service';
export const useAttendanceData = (taho_id: string | null) => {
  return useQuery({
    queryKey: ['attendancesss', taho_id],
    queryFn: () => fetchMonthlyAttendanceChartData(taho_id ? taho_id : ''),
    enabled: !!taho_id,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
  });
};
