import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { LogsApiResponse } from '@/libs/validations/logs';
import { getLogsList, LogsListParams } from '@/services/hr/logs.services';

import { UseQueryConfig } from '@/types';

export const useLogsListQuery = (
  params: LogsListParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['logsList', params],
    queryFn: () => getLogsList(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<LogsApiResponse, Error>;
