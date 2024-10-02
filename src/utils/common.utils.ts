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
      // TODO: remove this when all schemas are fixed
    } catch (error) {
      if (!isProd) {
        console.error(
          'Error parsing data with schema:',
          JSON.stringify(error, null, 2),
        );
        throw error;
      }

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
  return 'ontouchstart' in window;
}

export function getQueryParamsString(
  data: Record<string, string | number | boolean | null | undefined>,
): string {
  return Object.entries(data)
    .filter(([, value]) => value !== null && value !== undefined)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value!)}`,
    )
    .join('&');
}

export function maskedAccountNumber(value: number | string): string {
  const strValue = value.toString();
  return strValue.replace(/.(?=.{3})/g, '*');
}
