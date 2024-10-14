import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  getLeaveListRecords,
  getPendingLeaveRequest,
  getTrendLeaveChartData,
  LeaveListParams,
  LeaveListRecordParams,
  PendingLeaveRequestParams,
  postLeaveList,
} from '@/services/hr/leave-list.service';

import { UseQueryConfig } from '@/types';
import {
  LeaveListApiResponse,
  LeaveListRecords,
  LeaveTrendChartApiResponse,
} from '@/types/hr-leave-list.types';

export const useLeaveListPostQuery = (
  params: LeaveListParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['postLeaveList', params],
    queryFn: () => postLeaveList(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<LeaveListApiResponse, Error>;

export const useLeaveListRecordQuery = (
  params: LeaveListRecordParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['leaveListRecords', params],
    queryFn: () => getLeaveListRecords(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<LeaveListRecords, Error>;

export const usePendingLeaveRequestQuery = (
  params: PendingLeaveRequestParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['getPendingLeaveRequest', params],
    queryFn: () => getPendingLeaveRequest(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<LeaveListApiResponse, Error>;

export const useLeaveTrendChartQuery = (config: UseQueryConfig = {}) =>
  useQuery({
    queryKey: ['getLeaveChartData'],
    queryFn: () => getTrendLeaveChartData(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<LeaveTrendChartApiResponse, Error>;
