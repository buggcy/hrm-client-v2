import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export type AttendanceHistoryState = {
  refetchAttendanceHistoryList: boolean;
};

export type AttendanceHistoryActions = {
  setRefetchAttendanceHistoryList: (res: boolean) => void;
};

export type AttendanceHistoryStoreType = AttendanceHistoryState &
  AttendanceHistoryActions;

export const useAttendanceHistoryStore = create<AttendanceHistoryStoreType>()(
  devtools(
    persist(
      set => ({
        refetchAttendanceHistoryList: false,

        // Actions
        setRefetchAttendanceHistoryList: (res: boolean) =>
          set({ refetchAttendanceHistoryList: res }),
      }),
      {
        name: 'attendance-history-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { name: 'AttendanceHistoryStore' },
  ),
);
