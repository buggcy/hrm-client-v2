import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export type ProjectState = {
  refetchProjectList: boolean;
};

export type ProjectActions = {
  setRefetchProjectList: (res: boolean) => void;
};

export type ProjectStoreType = ProjectState & ProjectActions;

export const useProjectStore = create<ProjectStoreType>()(
  devtools(
    persist(
      set => ({
        refetchProjectList: false,

        // Actions
        setRefetchProjectList: (res: boolean) =>
          set({ refetchProjectList: res }),
      }),
      {
        name: 'project-department-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { name: 'ProjectStore' },
  ),
);
