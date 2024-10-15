import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { getLeaveData } from '@/services/employee/leave-history.service';
import {
  getLeaveListRecords,
  getPendingLeaveRequest,
  LeaveListParams,
  LeaveListRecordParams,
  PendingLeaveRequestParams,
  postLeaveList,
} from '@/services/hr/leave-list.service';

import { UseQueryConfig } from '@/types';
import {
  LeaveListApiResponse,
  LeaveListRecords,
} from '@/types/hr-leave-list.types';
import { EmployeeLeavesDataApiResponse } from '@/types/leave-history.types';

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

export const useAllowLeaveListQuery = (
  id: string,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['allowLeaveList', id],
    queryFn: () => getLeaveData({ employeeId: id }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<EmployeeLeavesDataApiResponse, Error>;
