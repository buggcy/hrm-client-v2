import { z } from 'zod';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  DEVELOPER = 'developer',
}

export const IUser = z.object({
  id: z.number().int(),
  last_name: z.string(),
  first_name: z.string(),
  uuid: z.string().uuid(),
  email: z.string().email(),
  role: z.nativeEnum(UserRole),
  billing_account_id: z.number().int().optional(),
  created_at: z.string().transform(str => new Date(str)),
  updated_at: z.string().transform(str => new Date(str)),
});

export type IUser = z.infer<typeof IUser>;
