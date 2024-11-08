import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export type ComplaintState = {
  refetchComplaintList: boolean;
};

export type ComplaintActions = {
  setRefetchComplaintList: (res: boolean) => void;
};

export type ComplaintStoreType = ComplaintState & ComplaintActions;

export const useComplaintStore = create<ComplaintStoreType>()(
  devtools(
    persist(
      set => ({
        refetchComplaintList: false,

        // Actions
        setRefetchComplaintList: (res: boolean) =>
          set({ refetchComplaintList: res }),
      }),
      {
        name: 'complaint-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { name: 'ComplaintStore' },
  ),
);
