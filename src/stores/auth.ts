import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import { User } from '@/types/user.types';
import { Permission } from '@/types/user-permissions.types';

export type AuthState = {
  loading: boolean;
  user: User | null;
  token: string | null;
  accessPermissions: Permission[];
  readPermissions: Permission[];
  writePermissions: Permission[];
};

export type AuthActions = {
  setLoadingTrue: () => void;
  setLoadingFalse: () => void;
  setUser: (token: string) => void;
  setToken: (token: string) => void;
  setAccessPermissions: (permissions: Permission[]) => void;
  setReadPermissions: (permissions: Permission[]) => void;
  setWritePermissions: (permissions: Permission[]) => void;
  resetSession: () => void;
};

export type AuthStoreType = AuthState & AuthActions;

export const useAuthStore = create<AuthStoreType>()(
  devtools(
    persist(
      set => ({
        loading: false,
        user: null,
        token: null,
        accessPermissions: [],
        readPermissions: [],
        writePermissions: [],

        // Actions
        setLoadingTrue: () => set({ loading: true }),
        setLoadingFalse: () => set({ loading: false }),
        setUser: (token: string) => {
          const user = jwtDecode<User>(token);
          set({ user, token });
        },
        setToken: (token: string) => set({ token }),
        setAccessPermissions: (permissions: Permission[]) =>
          set({ accessPermissions: permissions }),
        setReadPermissions: (permissions: Permission[]) =>
          set({ readPermissions: permissions }),
        setWritePermissions: (permissions: Permission[]) =>
          set({ writePermissions: permissions }),
        resetSession: () => {
          Cookies.remove('hrmsToken');
          set({ token: null });
          set({ user: null });
          set({ accessPermissions: [] });
          set({ readPermissions: [] });
          set({ writePermissions: [] });
        },
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => localStorage),
      },
    ),
    { name: 'AuthStore' },
  ),
);
