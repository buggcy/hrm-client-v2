import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export type LeaveState = {
  refetchLeaveList: boolean;
};

export type LeaveActions = {
  setRefetchLeaveList: (res: boolean) => void;
};

export type LeaveStoreType = LeaveState & LeaveActions;

export const useLeaveStore = create<LeaveStoreType>()(
  devtools(
    persist(
      set => ({
        refetchLeaveList: false,

        // Actions
        setRefetchLeaveList: (res: boolean) => set({ refetchLeaveList: res }),
      }),
      {
        name: 'leave-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { name: 'LeaveStore' },
  ),
);
