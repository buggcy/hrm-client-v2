import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { HttpService } from '@/utils';

import { IVideo } from '@/types';

export type RenameVideoDto = Pick<IVideo, 'video_id' | 'video_name'>;

export const useRenameVideoMutation = (
  options?: UseMutationOptions<void, Error, RenameVideoDto>,
) =>
  useMutation<void, Error, RenameVideoDto>({
    mutationKey: ['rename-video'],
    mutationFn: ({ video_id, video_name }: RenameVideoDto) =>
      HttpService.patch(`/proxy/rqh/v2/videos/${video_id}/name`, {
        video_name,
      }),
    // TODO: add cache invalidation
    ...options,
  });
