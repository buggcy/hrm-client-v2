import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ParseParams, z } from 'zod';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const schemaParse =
  <Schema extends z.AnyZodObject>(schema: Schema) =>
  (data: unknown, params?: ParseParams): z.infer<Schema> => {
    try {
      return schema.parse(data, params);
    } catch (error) {
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
