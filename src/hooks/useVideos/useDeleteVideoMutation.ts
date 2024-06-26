import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { queryClient } from '@/libs';
import { rqhApi } from '@/utils';

import { IVideo } from '@/types';

export const useDeleteVideoMutation = ({
  onSuccess,
  ...options
}: UseMutationOptions<void, Error, IVideo['video_id']> = {}) =>
  useMutation<void, Error, IVideo['video_id']>({
    mutationFn: (id: IVideo['video_id']) => rqhApi.delete(`/v2/videos/${id}`),
    onSuccess: (...data) => {
      onSuccess?.(...data);
      void queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
    // TODO: add cache invalidation
    ...options,
  });
