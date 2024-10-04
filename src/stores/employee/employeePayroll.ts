import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export type EmployeePayrollState = {
  refetchEmployeePayrollList: boolean;
};

export type EmployeeActions = {
  setRefetchEmployeePayrollList: (res: boolean) => void;
};

export type EmployeePayrollStoreType = EmployeePayrollState & EmployeeActions;

export const useEmployeePayrollStore = create<EmployeePayrollStoreType>()(
  devtools(
    persist(
      set => ({
        refetchEmployeePayrollList: false,

        setRefetchEmployeePayrollList: (res: boolean) =>
          set({ refetchEmployeePayrollList: res }),
      }),
      {
        name: 'employeePayroll-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { name: 'EmployeePayrollStore' },
  ),
);
