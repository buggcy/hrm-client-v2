import { QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { z } from 'zod';

import { queryClient } from '@/libs';
import { rqhApi, schemaParse } from '@/utils';

import { IVideo } from '@/types';

export const IVideosResponse = z.object({
  data: z.array(IVideo),
  total_count: z.number(),
});
export type IVideosResponse = z.infer<typeof IVideosResponse>;

type UseVideosQueryParams = {
  queryKey?: QueryKey;
  // TODO: Define the type of the queryParams like in API
  queryParams?: Record<string, unknown>;
} & Omit<UseQueryOptions<IVideosResponse>, 'queryKey' | 'queryFn'>;

export const useVideosQuery = ({
  queryKey,
  queryParams,
  ...config
}: UseVideosQueryParams = {}) =>
  useQuery<IVideosResponse>({
    queryKey: queryKey || ['videos', queryParams],
    queryFn: () =>
      rqhApi
        .get('/v2/videos', { params: queryParams })
        .then(schemaParse(IVideosResponse))
        .then(data => {
          data.data.forEach(video => {
            queryClient.setQueryData(['video', video.video_id], video);
          });
          return data;
        }),
    ...config,
  });
