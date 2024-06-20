import {
  MutationFunction,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query';

import { rqhApi } from '@/utils';

import { IReplica, IVideo } from '@/types';

export type CreateVideoDto = {
  replica_id: IReplica['replica_id'];
  video_name?: IVideo['video_name'];
  background_url?: string;
  background_source_url?: string;
  callback_url?: string;
} & (
  | { script: IVideo['data']['script']; audio_url?: never }
  | { script?: never; audio_url: IVideo['data']['audio_url'] }
);

// TODO: Transform this into zod schema
export type CreateVideoResponse = Pick<
  IVideo,
  'video_id' | 'video_name' | 'status'
>;

const createVideo: MutationFunction<
  CreateVideoResponse,
  CreateVideoDto
> = data => rqhApi.post('/v2/videos/', data);

export const useCreateVideoMutation = (
  options?: UseMutationOptions<CreateVideoResponse, Error, CreateVideoDto>,
) =>
  useMutation<CreateVideoResponse, Error, CreateVideoDto>({
    mutationKey: ['generate-video'],
    mutationFn: createVideo,
    // TODO: add cache invalidation
    ...options,
  });
