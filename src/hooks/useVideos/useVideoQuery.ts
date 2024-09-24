import { useQuery } from '@tanstack/react-query';

import { baseAPI, schemaParse } from '@/utils';

import { IVideo, UseQueryConfig } from '@/types';

export const useVideoQuery = (
  id?: IVideo['video_id'],
  config?: UseQueryConfig<IVideo>,
) =>
  useQuery<IVideo, Error>({
    queryKey: ['video', id],
    queryFn: ({ signal }) =>
      baseAPI.get(`/v2/videos/${id}`, { signal }).then(schemaParse(IVideo)),
    enabled: !!id,
    ...config,
  });
