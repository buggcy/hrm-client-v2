import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export type ConfigurationState = {
  refetchConfigurationList: boolean;
};

export type ConfigurationActions = {
  setRefetchConfigurationList: (res: boolean) => void;
};

export type ConfigurationStoreType = ConfigurationState & ConfigurationActions;

export const useConfigurationStore = create<ConfigurationStoreType>()(
  devtools(
    persist(
      set => ({
        refetchConfigurationList: false,

        // Actions
        setRefetchConfigurationList: (res: boolean) =>
          set({ refetchConfigurationList: res }),
      }),
      {
        name: 'configuration-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { name: 'ConfigurationStore' },
  ),
);
