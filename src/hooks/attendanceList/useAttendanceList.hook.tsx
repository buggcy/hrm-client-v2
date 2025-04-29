import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  AttendanceApiResponse,
  AttendanceByDateApiResponse,
  AttendanceRequestApiResponse,
} from '@/libs/validations/attendance-list';
import {
  AttendanceListParams,
  AttendanceRequestParams,
  getAttendanceByUserIdAndDate,
  getAttendanceDistributionStats,
  getAttendanceList,
  getAttendanceRequestList,
} from '@/services/hr/attendance-list.service';

import { UseQueryConfig } from '@/types';
import { AttendanceDistributionApiResponse } from '@/types/attendance-list.types';

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
  }) as UseQueryResult<AttendanceApiResponse, Error>;

export const useAttendanceRequestsQuery = (
  params: AttendanceRequestParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['attendanceRequestList', params],
    queryFn: () => getAttendanceRequestList(params),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<AttendanceRequestApiResponse, Error>;

export const useAttendanceOverviewQuery = (
  date?: Date,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['attendanceOverviewList', date],
    queryFn: () => getAttendanceDistributionStats({ date: date ?? new Date() }),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<AttendanceDistributionApiResponse, Error>;

export const useAttendanceByDateQuery = (
  id: string,
  date: string,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['attendanceByDate', id, date],
    queryFn: () => getAttendanceByUserIdAndDate({ id, date }),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
    enabled: !!id && !!date,
  }) as UseQueryResult<AttendanceByDateApiResponse, Error>;
