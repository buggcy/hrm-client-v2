import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  getHrEventsList,
  HrEventsListParams,
} from '@/services/hr/hrEvents.service';

import { UseQueryConfig } from '@/types';
import { HrEventApiResponse } from '@/types/hrEvents.types';

export const useHrEventsQuery = (
  params: HrEventsListParams,
  config: UseQueryConfig = {},
) =>
  useQuery({
    queryKey: ['hrEvents', params],
    queryFn: () => getHrEventsList(params),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<HrEventApiResponse, Error>;
