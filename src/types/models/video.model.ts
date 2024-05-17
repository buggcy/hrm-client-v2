import { z } from 'zod';

export enum VideoStatus {
  ERROR = 'error',
  READY = 'ready',
  QUEUED = 'queued',
  GENERATING = 'generating',
}

export const IVideo = z.object({
  video_id: z.string().uuid(),
  video_name: z.string(),
  status: z.nativeEnum(VideoStatus),
  data: z.object({
    script: z.string().optional(),
    audio_url: z.string().url().optional(),
  }),
  status_details: z.string(),
  hosted_url: z.string().url(),
  stream_url: z.string().url().nullable(),
  download_url: z.string().url().nullable(),
  gif_thumbnail_url: z.string().url().nullable().optional(),
  still_image_thumbnail_url: z.string().url().nullable().optional(),
  created_at: z.string().transform(str => new Date(str)),
  updated_at: z.string().transform(str => new Date(str)),
});

export type IVideo = z.infer<typeof IVideo>;
