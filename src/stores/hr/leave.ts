import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export type ManageLeaveState = {
  refetchManageLeaveList: boolean;
};

export type ManageLeaveActions = {
  setRefetchManageLeaveList: (res: boolean) => void;
};

export type ManageLeaveStoreType = ManageLeaveState & ManageLeaveActions;

export const useManageLeaveStore = create<ManageLeaveStoreType>()(
  devtools(
    persist(
      set => ({
        refetchManageLeaveList: false,

        // Actions
        setRefetchManageLeaveList: (res: boolean) =>
          set({ refetchManageLeaveList: res }),
      }),
      {
        name: 'manage-leave-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { name: 'ManageLeaveStore' },
  ),
);
