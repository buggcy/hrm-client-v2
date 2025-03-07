import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  OvertimeListApiResponse,
  OvertimeRequestListApiResponse,
} from '@/libs/validations/overtime';
import {
  getOvertime,
  getOvertimeRequest,
  RequestBodyParams,
  RequestParams,
} from '@/services/employee/overtime.service';

import { UseQueryConfig } from '@/types';

export const useOvertimeQuery = (
  params: RequestBodyParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['getOvertime', params],
    queryFn: () => getOvertime(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<OvertimeListApiResponse, Error>;

export const useOvertimeRequestsQuery = (
  params: RequestParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['pendingList', params],
    queryFn: () => getOvertimeRequest(params),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<OvertimeRequestListApiResponse, Error>;
