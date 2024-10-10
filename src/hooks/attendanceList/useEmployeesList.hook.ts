import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { getEmployeeList } from '@/services/hr/attendance-list.service';

import { UseQueryConfig } from '@/types';
import { AttendanceUsers } from '@/types/attendance-list.types';

export const useAttendanceUsersQuery = (config: UseQueryConfig = {}) =>
  useQuery({
    queryKey: ['attendanceUsers'],
    queryFn: () => getEmployeeList(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<AttendanceUsers, Error>;
