import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export type EmployeeAnniversaryState = {
  refetchEmployeeList: boolean;
};

export type EmployeeAnniversaryActions = {
  setRefetchEmployeeList: (res: boolean) => void;
};

export type EmployeeAnniversaryStoreType = EmployeeAnniversaryState &
  EmployeeAnniversaryActions;

export const useEmployeeAnniversaryStore =
  create<EmployeeAnniversaryStoreType>()(
    devtools(
      persist(
        set => ({
          refetchEmployeeList: false,

          // Actions
          setRefetchEmployeeList: (res: boolean) =>
            set({ refetchEmployeeList: res }),
        }),
        {
          name: 'employeeAnniversary-storage',
          storage: createJSONStorage(() => sessionStorage),
        },
      ),
      { name: 'EmployeeAnniversaryStore' },
    ),
  );
