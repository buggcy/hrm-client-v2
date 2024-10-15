import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export type AttendanceListState = {
  refetchAttendanceList: boolean;
};

export type AttendanceListActions = {
  setRefetchAttendanceList: (res: boolean) => void;
};

export type AttendanceListStoreType = AttendanceListState &
  AttendanceListActions;

export const useAttendanceListStore = create<AttendanceListStoreType>()(
  devtools(
    persist(
      set => ({
        refetchAttendanceList: false,

        setRefetchAttendanceList: (res: boolean) =>
          set({ refetchAttendanceList: res }),
      }),
      {
        name: 'attendance-list-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { name: 'AttendanceListStore' },
  ),
);
