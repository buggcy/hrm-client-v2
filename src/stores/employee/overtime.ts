import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export type OvertimeState = {
  refetchOvertimeList: boolean;
};

export type OvertimeActions = {
  setRefetchOvertimeList: (res: boolean) => void;
};

export type OvertimeStoreType = OvertimeState & OvertimeActions;

export const useOvertimeStore = create<OvertimeStoreType>()(
  devtools(
    persist(
      set => ({
        refetchOvertimeList: false,

        // Actions
        setRefetchOvertimeList: (res: boolean) =>
          set({ refetchOvertimeList: res }),
      }),
      {
        name: 'overtime-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { name: 'OvertimeStore' },
  ),
);
