import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export type LogsListState = {
  refetchLogsList: boolean;
};

export type LogsListActions = {
  setRefetchLogsList: (res: boolean) => void;
};

export type LogsListStoreType = LogsListState & LogsListActions;

export const useLogsListStore = create<LogsListStoreType>()(
  devtools(
    persist(
      set => ({
        refetchLogsList: false,

        // Actions
        setRefetchLogsList: (res: boolean) => set({ refetchLogsList: res }),
      }),
      {
        name: 'employee-storage', //..
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { name: 'LogsStore' },
  ),
);
