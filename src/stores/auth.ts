import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import { User } from '@/types/user.types';

export type AuthState = {
  loading: boolean;
  user: User | null;
  token: string | null;
};

export type AuthActions = {
  setLoadingTrue: () => void;
  setLoadingFalse: () => void;
  setUser: (token: string) => void;
  setToken: (token: string) => void;
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

        // Actions
        setLoadingTrue: () => set({ loading: true }),
        setLoadingFalse: () => set({ loading: false }),
        setUser: (token: string) => {
          const user = jwtDecode<User>(token);
          set({ user, token });
        },
        setToken: (token: string) => set({ token }),
        resetSession: () => {
          set({ token: null });
          set({ user: null });
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
