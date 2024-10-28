import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  AllowLeaveList,
  EmployeePerkList,
  ExtraLeaveParams,
  getExtraLeave,
} from '@/services/hr/manage.leave.service';

import { UseQueryConfig } from '@/types';
import { EmployeeLeavesDataApiResponse } from '@/types/leave-history.types';
import {
  EmployeePerks,
  ExtraLeaveApiResponse,
} from '@/types/manageLeave.types';

export const useEmployeePerkListQuery = (config: UseQueryConfig = {}) =>
  useQuery({
    queryKey: ['employeePerkList'],
    queryFn: () => EmployeePerkList(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<EmployeePerks[], Error>;

export const useAllowLeaveListQuery = (
  id: string,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['allowLeaveList', id],
    queryFn: () => AllowLeaveList(id),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<EmployeeLeavesDataApiResponse, Error>;

export const useExtraLeaveRequestQuery = (
  id: string,
  params: ExtraLeaveParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['getExtraLeave', id, params],
    queryFn: () => getExtraLeave(id, params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<ExtraLeaveApiResponse, Error>;
