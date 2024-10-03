import { useQuery } from '@tanstack/react-query';

import { fetchWeeklyAttendance } from '@/services/employee/dashboard.service';

import { AttendanceData } from '@/types/attendence.types';

export const useEmployeeAttendance = (employeeId: string | null) => {
  return useQuery<AttendanceData, Error>({
    queryKey: ['attendance', employeeId],
    queryFn: () => fetchWeeklyAttendance(employeeId ?? ''),
    refetchInterval: 1000 * 60 * 5,
    enabled: !!employeeId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
