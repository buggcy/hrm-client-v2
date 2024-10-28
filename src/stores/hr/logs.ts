import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export type LogState = {
  refetchLogList: boolean;
};

export type LogActions = {
  setRefetchLogList: (res: boolean) => void;
};

export type LogStoreType = LogState & LogActions;

export const useLogStore = create<LogStoreType>()(
  devtools(
    persist(
      set => ({
        refetchLogList: false,

        // Actions
        setRefetchLogList: (res: boolean) => set({ refetchLogList: res }),
      }),
      {
        name: 'log-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { name: 'LogStore' },
  ),
);
