import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { LogParams, postLogList } from '@/services/hr/log.service';

import { UseQueryConfig } from '@/types';
import { LogsApiResponse } from '@/types/hr-logs.types';

export const useLogListQuery = (
  params: LogParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['logList', params],
    queryFn: () => postLogList(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<LogsApiResponse, Error>;
