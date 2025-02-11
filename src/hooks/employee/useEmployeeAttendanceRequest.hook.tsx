import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  AttendanceRequestApiResponse,
  AttendanceRequestStatsAPIResponse,
} from '@/libs/validations/attendance-request';
import {
  AttendanceRequestsParams,
  AttendanceRequestStatsParams,
  getAttendanceRequests,
  getAttendanceRequestStats,
} from '@/services/employee/attendance-request.service';

import { UseQueryConfig } from '@/types';

export const useAttendanceRequestStats = (
  params: AttendanceRequestStatsParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['attendanceRequestStats', params],
    queryFn: () => getAttendanceRequestStats(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<AttendanceRequestStatsAPIResponse, Error>;

export const useAttendanceRequests = (
  params: AttendanceRequestsParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['attendanceRequestsForEmployee', params],
    queryFn: () => getAttendanceRequests(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<AttendanceRequestApiResponse, Error>;
