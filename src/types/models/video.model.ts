import { z } from 'zod';

export enum VideoStatus {
  ERROR = 'error',
  READY = 'ready',
  QUEUED = 'queued',
  GENERATING = 'generating',
  DELETED = 'deleted',
}

export const IVideo = z.object({
  video_id: z.string(),
  video_name: z.string().nullish(),
  status: z.nativeEnum(VideoStatus),
  data: z.object({
    script: z.string().optional(),
    audio_url: z.string().url().optional(),
  }),
  status_details: z.string().optional(),
  hosted_url: z.string().url().nullish(),
  stream_url: z.string().url().nullish(),
  download_url: z.string().url().nullish(),
  gif_thumbnail_url: z.string().url().nullish(),
  still_image_thumbnail_url: z.string().url().nullish(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type IVideo = z.infer<typeof IVideo>;
