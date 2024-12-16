import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  AttendanceHistoryListParams,
  getAttendanceHistoryList,
  getTodayAttendence,
} from '@/services/employee/attendance-history.service';

import { UseQueryConfig } from '@/types';
import {
  AttendanceHistoryApiResponse,
  todayAttendenceApiResponse,
} from '@/types/attendance-history.types';

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

export const useTodayAttendence = (
  userId: string,
  date: string,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['todayAttendences', userId, date],
    queryFn: () => getTodayAttendence(userId, date),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
    enabled: !!userId && !!date,
  }) as UseQueryResult<todayAttendenceApiResponse, Error>;
