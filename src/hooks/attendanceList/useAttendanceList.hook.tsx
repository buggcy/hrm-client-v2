import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  AttendanceListParams,
  getAttendanceList,
} from '@/services/hr/attendance-list.service';

import { UseQueryConfig } from '@/types';
import { AttendanceListApiResponse } from '@/types/attendance-list.types';

export const useAttendanceListQuery = (
  params: AttendanceListParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['attendanceHistoryList', params],
    queryFn: () => getAttendanceList(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<AttendanceListApiResponse, Error>;
