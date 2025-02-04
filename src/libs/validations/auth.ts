import { z } from 'zod';

const permissionSchema = z.object({
  _id: z.string(),
  name: z.string(),
  allowed: z.boolean(),
});

const roleSchema = z.object({
  _id: z.string(),
  roleId: z.number(),
  permissions: z.array(permissionSchema),
});

export type UserPermissions = z.infer<typeof roleSchema>;

export { roleSchema };
