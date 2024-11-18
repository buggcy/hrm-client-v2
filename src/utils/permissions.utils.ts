import { useAuthStore } from '@/stores/auth';

const { readPermissions, writePermissions } = useAuthStore.getState();

export const getReadPermissions = (name: string) => {
  return readPermissions.some(
    permission => permission.name === name && permission.allowed,
  );
};

export const getWritePermissions = (name: string) => {
  return writePermissions.some(
    permission => permission.name === name && permission.allowed,
  );
};
