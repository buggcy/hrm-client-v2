import { temporal, TemporalState } from 'zundo';
import { create, StoreApi } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useStoreWithEqualityFn } from 'zustand/traditional';

import { DEFAULT_REPLICA } from '../constants';
import { AudioTab, VideoBackgroundType, VideoGenerationType } from '../types';

import { IReplica } from '@/types';

export interface ICreateVideoFilesStore {
  audio: {
    file?: File;
    url: string;
    duration?: number;
  } | null;
  background: {
    file?: File;
    url: string;
    duration?: number;
  } | null;
  set: StoreApi<ICreateVideoFilesStore>['setState'];
}

export type Require<T> = {
  [P in keyof T]-?: T[P];
};

export interface ICreateVideoFormStore {
  replicaId: IReplica['replica_id'];
  audioTab: AudioTab;
  script?: string;
  audioUrl?: string;
  name?: string;
  callbackUrl?: string;
  backgroundUrl?: string;
  backgroundSourceUrl?: string;
  type: VideoGenerationType;
  isAdvancedSettingsOpen: boolean;
  withBackground: boolean;
  backgroundType: VideoBackgroundType;
  set: StoreApi<ICreateVideoFormStore>['setState'];
}

export const useCreateVideoFormStore = create<ICreateVideoFormStore>()(
  persist(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-call
    temporal(set => ({
      replicaId: DEFAULT_REPLICA.replica_id,
      type: VideoGenerationType.SCRIPT,
      isAdvancedSettingsOpen: false,
      withBackground: false,
      audioTab: AudioTab.UPLOAD,
      backgroundType: VideoBackgroundType.UPLOAD_FILE,
      set,
    })),
    {
      name: 'useCreateVideoFormStore',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export const useCreateVideoFormUndoHistory = <T,>(
  selector: (state: TemporalState<ICreateVideoFormStore>) => T,
  equality?: (a: T, b: T) => boolean,
) =>
  useStoreWithEqualityFn(useCreateVideoFormStore.temporal, selector, equality);

export const useCreateVideoFilesStore = create<ICreateVideoFilesStore>(set => ({
  audio: null,
  background: null,
  set,
}));
