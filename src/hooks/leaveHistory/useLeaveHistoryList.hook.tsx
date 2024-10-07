import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  getLeaveHistoryList,
  LeaveHistoryListParams,
} from '@/services/employee/leave-history.service';

import { UseQueryConfig } from '@/types';
import { LeaveHistoryApiResponse } from '@/types/leave-history.types';

export const useLeaveHistoryListQuery = (
  params: LeaveHistoryListParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['leaveHistoryList', params],
    queryFn: () => getLeaveHistoryList(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<LeaveHistoryApiResponse, Error>;
