import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export type LeaveHistoryState = {
  refetchLeaveHistoryList: boolean;
};

export type LeaveHistoryActions = {
  setRefetchLeaveHistoryList: (res: boolean) => void;
};

export type LeaveHistoryStoreType = LeaveHistoryState & LeaveHistoryActions;

export const useLeaveHistoryStore = create<LeaveHistoryStoreType>()(
  devtools(
    persist(
      set => ({
        refetchLeaveHistoryList: false,

        // Actions
        setRefetchLeaveHistoryList: (res: boolean) =>
          set({ refetchLeaveHistoryList: res }),
      }),
      {
        name: 'leave-history-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { name: 'LeaveHistoryStore' },
  ),
);
