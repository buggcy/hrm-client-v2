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
  billingAccount: z
    .object({
      id: z.number().int(),
      // TODO: add enum
      status: z.string().nullable(),
      plan_id: z.string().nullable(),
      subscription_id: z.string().nullable(),
    })
    .nullable()
    .optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type IUser = z.infer<typeof IUser>;
