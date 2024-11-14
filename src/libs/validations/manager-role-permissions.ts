import { z } from 'zod';

const permissionSchema = z.object({
  _id: z.string(),
  name: z.string(),
  allowed: z.boolean(),
});

const roleSchema = z.object({
  _id: z.string(),
  roleId: z.number(),
  roleName: z.string(),
  permissions: z.array(permissionSchema),
});

const managerRolePermissionsApiResponseSchema = z.object({
  data: z.array(roleSchema),
});

export type ManagerRolePermissionsApiResponse = z.infer<
  typeof managerRolePermissionsApiResponseSchema
>;

const userSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  companyEmail: z.string(),
  Avatar: z.string().optional(),
});

const userPermissionSchema = z.object({
  _id: z.string(),
  roleId: z.number(),
  userId: userSchema,
  permissions: z.array(permissionSchema),
});

const managerUserPermissionsApiResponseSchema = z.object({
  data: z.array(userPermissionSchema),
});

export type ManagerUserPermissionsApiResponse = z.infer<
  typeof managerUserPermissionsApiResponseSchema
>;

export type UserPermission = z.infer<typeof userPermissionSchema>;
export {
  managerRolePermissionsApiResponseSchema,
  managerUserPermissionsApiResponseSchema,
};
