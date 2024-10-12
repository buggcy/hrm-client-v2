import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export type HrEventsState = {
  refetchHrEventsList: boolean;
};

export type HrEventsActions = {
  setRefetchHrEventsList: (res: boolean) => void;
};

export type HrEventsStoreType = HrEventsState & HrEventsActions;

export const useHrEventsStore = create<HrEventsStoreType>()(
  devtools(
    persist(
      set => ({
        refetchHrEventsList: false,

        setRefetchHrEventsList: (res: boolean) =>
          set({ refetchHrEventsList: res }),
      }),
      {
        name: 'hrEvents-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { name: 'HrEventsStore' },
  ),
);
