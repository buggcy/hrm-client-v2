import {
  ManagerRolePermissionsApiResponse,
  managerRolePermissionsApiResponseSchema,
  ManagerUserPermissionsApiResponse,
  managerUserPermissionsApiResponseSchema,
} from '@/libs/validations/manager-role-permissions';
import { baseAPI, schemaParse } from '@/utils';

export type SuccessMessageResponse = {
  message: string;
};

export const getRolePermissions =
  async (): Promise<ManagerRolePermissionsApiResponse> => {
    const res = await baseAPI.get(`/getRolePermissions`);
    return schemaParse(managerRolePermissionsApiResponseSchema)(res);
  };

export const getPagePermissions =
  async (): Promise<ManagerRolePermissionsApiResponse> => {
    const res = await baseAPI.get(`/getPagePermissions`);
    return schemaParse(managerRolePermissionsApiResponseSchema)(res);
  };

export const getUserPermissions =
  async (): Promise<ManagerUserPermissionsApiResponse> => {
    const res = await baseAPI.get(`/getPermissions/users`);
    // console.log('res', res);
    const parsedData = schemaParse(managerUserPermissionsApiResponseSchema)(
      res,
    );
    console.log('parsedData', parsedData);
    return schemaParse(managerUserPermissionsApiResponseSchema)(res);
  };

export const updateUserPermission = async ({
  userId = '',
  name = '',
  allowed = false,
}: {
  userId: string;
  name: string;
  allowed: boolean;
}): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.put(
    `/updatePermission/${userId}`,
    {
      name,
      allowed,
    },
  );
  return { message };
};

export const changeRolePermission = async ({
  roleId = 1,
  name = '',
  allowed = false,
}: {
  roleId: number;
  name: string;
  allowed: boolean;
}): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.put(
    `/updatePermission`,
    {
      roleId,
      name,
      allowed,
    },
  );
  return { message };
};

export const addPermission = async ({
  name = '',
  roleIds = [],
}: {
  name: string;
  roleIds: number[];
}): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.post(
    `/addPermission`,
    {
      name,
      roleIds,
    },
  );
  return { message };
};

export const addRoles = async ({
  roleId,
  roleName = '',
}: {
  roleId: number;
  roleName: string;
}): Promise<SuccessMessageResponse> => {
  const { message }: SuccessMessageResponse = await baseAPI.post(`/addRoles`, {
    roleId,
    roleName,
  });
  return { message };
};
