import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { HttpService, schemaParse } from '@/utils';

import { IVideo } from '@/types';

export const useVideoQuery = (
  id: IVideo['video_id'],
  config: Omit<UseQueryOptions<IVideo>, 'queryKey' | 'queryFn'> = {},
) =>
  useQuery<IVideo, Error>({
    queryKey: ['video', id],
    queryFn: () =>
      HttpService.get(`/proxy/rqh/v2/videos/${id}`).then(schemaParse(IVideo)),
    ...config,
  });
