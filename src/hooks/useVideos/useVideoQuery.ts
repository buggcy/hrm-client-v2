import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { rqhApi, schemaParse } from '@/utils';

import { IVideo } from '@/types';

export const useVideoQuery = (
  id: IVideo['video_id'],
  config: Omit<UseQueryOptions<IVideo>, 'queryKey' | 'queryFn'> = {},
) =>
  useQuery<IVideo, Error>({
    queryKey: ['video', id],
    queryFn: () => rqhApi.get(`/v2/videos/${id}`).then(schemaParse(IVideo)),
    ...config,
  });
