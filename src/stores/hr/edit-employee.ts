import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export type EditEmployeeState = {
  refetchEditEmployeeData: boolean;
};

export type EditEmployeeActions = {
  setRefetchEditEmployeeData: (res: boolean) => void;
};

export type EditEmployeeStoreType = EditEmployeeState & EditEmployeeActions;

export const useEditEmployeeStore = create<EditEmployeeStoreType>()(
  devtools(
    persist(
      set => ({
        refetchEditEmployeeData: false,

        setRefetchEditEmployeeData: (res: boolean) =>
          set({ refetchEditEmployeeData: res }),
      }),
      {
        name: 'employee-edit-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { name: 'EditEmployeeStore' },
  ),
);
