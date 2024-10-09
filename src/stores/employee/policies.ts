import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export type PolicyState = {
  refetchPolicyList: boolean;
};

export type PolicyActions = {
  setRefetchPolicyList: (res: boolean) => void;
};

export type PolicyStoreType = PolicyState & PolicyActions;

export const usePolicyStore = create<PolicyStoreType>()(
  devtools(
    persist(
      set => ({
        refetchPolicyList: false,
        setRefetchPolicyList: (res: boolean) => set({ refetchPolicyList: res }),
      }),
      {
        name: 'policy-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { name: 'PolicyStore' },
  ),
);
