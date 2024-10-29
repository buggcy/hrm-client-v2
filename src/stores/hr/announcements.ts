import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export type AnnouncementsState = {
  refetchAnnouncements: boolean;
};

export type AnnouncementsActions = {
  setRefetchAnnouncements: (res: boolean) => void;
};

export type AnnouncementsStoreType = AnnouncementsState & AnnouncementsActions;

export const useManageAnnouncementsStore = create<AnnouncementsStoreType>()(
  devtools(
    persist(
      set => ({
        refetchAnnouncements: false,

        setRefetchAnnouncements: (res: boolean) =>
          set({ refetchAnnouncements: res }),
      }),
      {
        name: 'manage-announcements-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { name: 'ManageAnnouncementsStore' },
  ),
);
