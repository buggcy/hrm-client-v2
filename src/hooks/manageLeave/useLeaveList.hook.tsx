import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  AllowLeaveList,
  EmployeePerkList,
} from '@/services/hr/manage.leave.service';

import { UseQueryConfig } from '@/types';
import { EmployeeLeavesDataApiResponse } from '@/types/leave-history.types';
import { EmployeePerks } from '@/types/manageLeave.types';

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
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<EmployeeLeavesDataApiResponse, Error>;
