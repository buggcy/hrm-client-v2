import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { AttendanceRequestStatsAPIResponse } from '@/libs/validations/attendance-request';
import {
  AttendanceRequestStatsParams,
  getAttendanceRequestStats,
} from '@/services/employee/attendance-request.service';

import { UseQueryConfig } from '@/types';

export const useAttendanceRequestStats = (
  params: AttendanceRequestStatsParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['attendanceHistoryList', params],
    queryFn: () => getAttendanceRequestStats(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<AttendanceRequestStatsAPIResponse, Error>;

export const useAttendanceRequests = (
  params: AttendanceRequestStatsParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['attendanceHistoryList', params],
    queryFn: () => getAttendanceRequestStats(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<AttendanceRequestStatsAPIResponse, Error>;
