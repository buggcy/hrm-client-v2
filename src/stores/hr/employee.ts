import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import { User } from '@/types/user.types';

export type EmployeeState = {
  loading: boolean;
  user: User | null;
  token: string | null;
};

export type EmployeeActions = {
  setLoadingTrue: () => void;
  setLoadingFalse: () => void;
};

export type EmployeeStoreType = EmployeeState & EmployeeActions;

export const useEmployeeStore = create<EmployeeStoreType>()(
  devtools(
    persist(
      set => ({
        loading: false,
        user: null,
        token: null,

        // Actions
        setLoadingTrue: () => set({ loading: true }),
        setLoadingFalse: () => set({ loading: false }),
      }),
      {
        name: 'employee-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { name: 'EmployeeStore' },
  ),
);
