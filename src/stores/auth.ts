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
  permissions: Permission[];
};

export type AuthActions = {
  setLoadingTrue: () => void;
  setLoadingFalse: () => void;
  setUser: (token: string) => void;
  setToken: (token: string) => void;
  setPermissions: (permissions: Permission[]) => void;
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
        permissions: [],

        // Actions
        setLoadingTrue: () => set({ loading: true }),
        setLoadingFalse: () => set({ loading: false }),
        setUser: (token: string) => {
          const user = jwtDecode<User>(token);
          set({ user, token });
        },
        setToken: (token: string) => set({ token }),
        setPermissions: (permissions: Permission[]) => set({ permissions }),
        resetSession: () => {
          Cookies.remove('hrmsToken');
          set({ token: null });
          set({ user: null });
          set({ permissions: [] });
        },
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { name: 'AuthStore' },
  ),
);
