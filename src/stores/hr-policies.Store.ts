import { create } from 'zustand';

import { PolicyType } from '@/libs/validations/hr-policy';

interface PolicyState {
  loading: boolean;
  policies: PolicyType[] | null;
  categories: string[] | null;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setPolicies: (policies: PolicyType[] | null) => void;
  setCategories: (categories: string[] | null) => void;
  setError: (error: string | null) => void;
}

export const usePolicyStore = create<PolicyState>(set => ({
  loading: false,
  policies: null,
  categories: null,
  error: null,
  setLoading: loading => set({ loading }),
  setPolicies: policies => set({ policies }),
  setCategories: categories => set({ categories }),
  setError: error => set({ error }),
}));
