import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export type PerkListState = {
  refetchPerkList: boolean;
};

export type PerkListActions = {
  setRefetchPerkList: (res: boolean) => void;
};

export type PerkListStoreType = PerkListState & PerkListActions;

export const usePerkListStore = create<PerkListStoreType>()(
  devtools(
    persist(
      set => ({
        refetchPerkList: false,

        // Actions
        setRefetchPerkList: (res: boolean) => set({ refetchPerkList: res }),
      }),
      {
        name: 'perk-list-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { name: 'PerkListStore' },
  ),
);
