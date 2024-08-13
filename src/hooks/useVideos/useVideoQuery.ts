import { useQuery } from '@tanstack/react-query';

import { rqhApi, schemaParse } from '@/utils';

import { IVideo, UseQueryConfig } from '@/types';

export const useVideoQuery = (
  id?: IVideo['video_id'],
  config?: UseQueryConfig<IVideo>,
) =>
  useQuery<IVideo, Error>({
    queryKey: ['video', id],
    queryFn: ({ signal }) =>
      rqhApi.get(`/v2/videos/${id}`, { signal }).then(schemaParse(IVideo)),
    enabled: !!id,
    ...config,
  });
