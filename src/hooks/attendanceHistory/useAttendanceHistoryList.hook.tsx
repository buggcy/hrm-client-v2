import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  AttendanceHistoryListParams,
  getAttendanceHistoryList,
} from '@/services/employee/attendance-history.service';

import { UseQueryConfig } from '@/types';
import { AttendanceHistoryApiResponse } from '@/types/attendance-history.types';

export const useAttendanceHistoryListQuery = (
  params: AttendanceHistoryListParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['attendanceHistoryList', params],
    queryFn: () => getAttendanceHistoryList(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<AttendanceHistoryApiResponse, Error>;
