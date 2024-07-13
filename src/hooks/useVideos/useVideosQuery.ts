import {
  Query,
  QueryKey,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { z } from 'zod';

import { queryClient } from '@/libs';
import { rqhApi, schemaParse } from '@/utils';

import { IVideo, VideoStatus } from '@/types';

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

export const useVideosQueryRefetchInterval = (
  query: Query<IVideosResponse>,
) => {
  if (
    query.state.data?.data?.some(
      ({ status }) =>
        status === VideoStatus.GENERATING || status === VideoStatus.QUEUED,
    )
  ) {
    return 10 * 1000;
  }

  return 5 * 60 * 1000;
};

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

export const prefetchVideos = () => {
  return queryClient.prefetchQuery({
    queryKey: [
      'videos',
      {
        page: 0,
        limit: 10,
        filter_out_status: [VideoStatus.QUEUED, VideoStatus.DELETED].join(','),
      },
    ],
    retry: 0,
    queryFn: () =>
      rqhApi
        .get('/v2/videos', {
          params: {
            page: 0,
            limit: 10,
            filter_out_status: [VideoStatus.QUEUED, VideoStatus.DELETED].join(
              ',',
            ),
          },
        })
        .then(schemaParse(IVideosResponse))
        .then(data => {
          data.data.forEach(video => {
            queryClient.setQueryData(['video', video.video_id], video);
          });
          return data;
        }),
  });
};
