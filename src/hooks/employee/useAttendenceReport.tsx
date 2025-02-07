import { useQuery } from '@tanstack/react-query';

import {
  EmployeeDashboardParams,
  fetchAttendanceReport,
} from '@/services/employee/dashboard.service';

import { AttendanceReport } from '@/types/attendence.types';

export const useAttendanceReport = (
  tahometerId: string | null,
  params: EmployeeDashboardParams,
) => {
  return useQuery<AttendanceReport | null>({
    queryKey: ['attendance-report', tahometerId, params],
    queryFn: () => fetchAttendanceReport(tahometerId ?? '', params),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: !!tahometerId && !!params?.from,
  });
};
