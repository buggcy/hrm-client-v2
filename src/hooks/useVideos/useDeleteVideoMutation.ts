import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { rqhApi } from '@/utils';

import { IVideo } from '@/types';

export const useDeleteVideoMutation = (
  options?: UseMutationOptions<void, Error, IVideo['video_id']>,
) => {
  return useMutation<void, Error, IVideo['video_id']>({
    mutationKey: ['delete-video'],
    mutationFn: (id: IVideo['video_id']) => rqhApi.delete(`/v2/videos/${id}`),
    // TODO: add cache invalidation
    ...options,
  });
};
