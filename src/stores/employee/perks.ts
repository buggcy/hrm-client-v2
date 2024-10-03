import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export type PerkState = {
  refetchPerkList: boolean;
};

export type PerkActions = {
  setRefetchPerkList: (res: boolean) => void;
};

export type PerkStoreType = PerkState & PerkActions;

export const usePerkStore = create<PerkStoreType>()(
  devtools(
    persist(
      set => ({
        refetchPerkList: false,

        // Actions
        setRefetchPerkList: (res: boolean) => set({ refetchPerkList: res }),
      }),
      {
        name: 'employee-perks-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { name: 'PerkStore' },
  ),
);
