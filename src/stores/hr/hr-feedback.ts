import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export type FeedbackState = {
  refetchFeedbackList: boolean;
};

export type FeedbackActions = {
  setRefetchFeedbackList: (res: boolean) => void;
};

export type FeedbackStoreType = FeedbackState & FeedbackActions;

export const useFeedbackStore = create<FeedbackStoreType>()(
  devtools(
    persist(
      set => ({
        refetchFeedbackList: false,

        // Actions
        setRefetchFeedbackList: (res: boolean) =>
          set({ refetchFeedbackList: res }),
      }),
      {
        name: 'seedback-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { name: 'FeedbackStore' },
  ),
);
