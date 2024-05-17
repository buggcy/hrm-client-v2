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
      throw error;
    }
  };
