import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  ManagerRolePermissionsApiResponse,
  ManagerUserPermissionsApiResponse,
} from '@/libs/validations/manager-role-permissions';
import {
  getPagePermissions,
  getRolePermissions,
  getUserPermissions,
} from '@/services/manager/manage-permissions.service';

import { UseQueryConfig } from '@/types';

export const usePermissionsQuery = (config: UseQueryConfig = {}) =>
  useQuery({
    queryKey: ['managerRolePermissions'],
    queryFn: () => getRolePermissions(),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<ManagerRolePermissionsApiResponse, Error>;

export const usePagePermissionsQuery = (config: UseQueryConfig = {}) =>
  useQuery({
    queryKey: ['managerPagePermissions'],
    queryFn: () => getPagePermissions(),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<ManagerRolePermissionsApiResponse, Error>;

export const useUserPermissionsQuery = (config: UseQueryConfig = {}) =>
  useQuery({
    queryKey: ['managerUserPermissions'],
    queryFn: () => getUserPermissions(),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 5,
    ...config,
  }) as UseQueryResult<ManagerUserPermissionsApiResponse, Error>;
