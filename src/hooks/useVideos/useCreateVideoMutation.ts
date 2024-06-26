import {
  MutationFunction,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query';
import { z } from 'zod';

import { rqhApi } from '@/utils';

import { IReplica, IVideo } from '@/types';

//
export const CreateVideoSchema = z.object({
  replica_id: z.string(),
  // Either script or audio_url is required
  script: z
    .string()
    .max(20000, {
      message: 'Script must be less than 20000 characters',
    })
    .optional(),
  audio_url: z
    .string()
    .url({
      message: 'Audio URL must be a valid URL',
    })
    .optional(),
  // Optional fields
  video_name: z.string().optional(),
  background_url: z
    .string()
    .url({
      message: 'Background URL must be a valid URL',
    })
    .optional(),
  background_source_url: z
    .string()
    .url({
      message: 'Background source URL must be a valid URL',
    })
    .optional(),
  callback_url: z
    .string()
    .url({
      message: 'Callback URL must be a valid URL',
    })
    .optional(),
});
// .refine(data => data.script || data.audio_url, {
//   message: 'Either script or audio_url is required',
// }) as unknown as z.AnyZodObject;
export type CreateVideoSchema = z.infer<typeof CreateVideoSchema>;

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
    mutationFn: createVideo,
    // TODO: add cache invalidation
    ...options,
  });
