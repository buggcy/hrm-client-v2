import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { z } from 'zod';

import { HttpService, schemaParse } from '@/utils';

import { IVideo } from '@/types';

const IVideosResponse = z.object({
  data: z.array(IVideo),
  total_count: z.number(),
});
type IVideosResponse = z.infer<typeof IVideosResponse>;

type UseVideosQueryParams = {
  // TODO: Define the type of the queryParams like in API
  queryParams?: Record<string, unknown>;
} & Omit<UseQueryOptions<IVideosResponse>, 'queryKey' | 'queryFn'>;

export const useVideosQuery = ({
  queryParams,
  ...config
}: UseVideosQueryParams = {}) =>
  useQuery<IVideosResponse>({
    queryKey: ['videos', queryParams],
    queryFn: () =>
      HttpService.get('/proxy/rqh/v2/videos', { params: queryParams }).then(
        schemaParse(IVideosResponse),
      ),
    ...config,
  });
