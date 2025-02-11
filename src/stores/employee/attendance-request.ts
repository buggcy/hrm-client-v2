import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export type AttendanceRequestState = {
  refetchAttendanceRequestList: boolean;
};

export type AttendanceRequestActions = {
  setRefetchAttendanceRequestList: (res: boolean) => void;
};

export type AttendanceRequestStoreType = AttendanceRequestState &
  AttendanceRequestActions;

export const useAttendanceRequestStore = create<AttendanceRequestStoreType>()(
  devtools(
    persist(
      set => ({
        refetchAttendanceRequestList: false,

        // Actions
        setRefetchAttendanceRequestList: (res: boolean) =>
          set({ refetchAttendanceRequestList: res }),
      }),
      {
        name: 'attendance-request-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { name: 'AttendanceRequestStore' },
  ),
);
