import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export type EmployeeState = {
  refetchEmployeeList: boolean;
};

export type EmployeeActions = {
  setRefetchEmployeeList: (res: boolean) => void;
};

export type EmployeeStoreType = EmployeeState & EmployeeActions;

export const useEmployeeStore = create<EmployeeStoreType>()(
  devtools(
    persist(
      set => ({
        refetchEmployeeList: false,

        // Actions
        setRefetchEmployeeList: (res: boolean) =>
          set({ refetchEmployeeList: res }),
      }),
      {
        name: 'employee-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { name: 'EmployeeStore' },
  ),
);
