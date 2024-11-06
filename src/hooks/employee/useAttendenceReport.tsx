import { useQuery } from '@tanstack/react-query';

import { fetchAttendanceReport } from '@/services/employee/dashboard.service';

import { AttendanceReport } from '@/types/attendence.types';

export const useAttendanceReport = (
  tahometerId: string | null,
  monthYear: string,
) => {
  return useQuery<AttendanceReport | null>({
    queryKey: ['attendance-report', tahometerId, monthYear],
    queryFn: () => fetchAttendanceReport(tahometerId ?? '', monthYear),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    enabled: !!tahometerId && !!monthYear,
  });
};
