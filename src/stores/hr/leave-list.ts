import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export type LeaveListState = {
  refetchLeaveList: boolean;
};

export type LeaveListActions = {
  setRefetchLeaveList: (res: boolean) => void;
};

export type LeaveListStoreType = LeaveListState & LeaveListActions;

export const useLeaveListStore = create<LeaveListStoreType>()(
  devtools(
    persist(
      set => ({
        refetchLeaveList: false,

        // Actions
        setRefetchLeaveList: (res: boolean) => set({ refetchLeaveList: res }),
      }),
      {
        name: 'hr-leave-list-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { name: 'LeaveListStore' },
  ),
);
