import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ParseParams, z } from 'zod';

import { isProd } from '@/constants';

import { IReplica } from '@/types';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const schemaParse =
  <Schema extends z.AnyZodObject>(schema: Schema) =>
  (data: unknown, params?: ParseParams): z.infer<Schema> => {
    try {
      return schema.parse(data, params);
    } catch (error) {
      if (!isProd)
        console.error(
          'Error parsing data with schema:',
          JSON.stringify(error, null, 2),
        );
      // TODO: remove this when all schemas are fixed
      return data as z.infer<Schema>;
    }
  };

export function getFilenameFromUrl(url: string) {
  const cleanUrl = url?.split('?')[0].split('#')[0] || '';
  const filename = cleanUrl.split('/').pop() || '';

  return decodeURIComponent(filename);
}

export function createReplicaThumbnailUrl(
  url?: IReplica['thumbnail_video_url'],
) {
  return url ? `${url}#t=1` : '';
}

export function isTouchDevice(): boolean {
  return !!(
    'ontouchstart' in window ||
    (window.DocumentTouch && document instanceof window.DocumentTouch)
  );
}
