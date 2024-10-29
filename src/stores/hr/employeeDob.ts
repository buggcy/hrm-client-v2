import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export type EmployeeDobState = {
  refetchEmployeeList: boolean;
};

export type EmployeeDobActions = {
  setRefetchEmployeeList: (res: boolean) => void;
};

export type EmployeeDobStoreType = EmployeeDobState & EmployeeDobActions;

export const useEmployeeDobStore = create<EmployeeDobStoreType>()(
  devtools(
    persist(
      set => ({
        refetchEmployeeList: false,

        // Actions
        setRefetchEmployeeList: (res: boolean) =>
          set({ refetchEmployeeList: res }),
      }),
      {
        name: 'employeeDob-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { name: 'EmployeeDobStore' },
  ),
);
