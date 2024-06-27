import { temporal, TemporalState } from 'zundo';
import { create, StoreApi } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useStoreWithEqualityFn } from 'zustand/traditional';

import { DEFAULT_REPLICA } from '../constnats';
import { AudioTab, VideoBackgroundType, VideoGenerationType } from '../types';

import { IReplica } from '@/types';

export interface IVideoGenerateFilesStore {
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
  set: StoreApi<IVideoGenerateFilesStore>['setState'];
}

export type Require<T> = {
  [P in keyof T]-?: T[P];
};

export interface IVideoGenerateFormStore {
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
  set: StoreApi<IVideoGenerateFormStore>['setState'];
}

export const useVideoGenerateFormStore = create<IVideoGenerateFormStore>()(
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
      name: 'useVideoFormStore',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export const useVideoGenerateFormUndoHistory = <T,>(
  selector: (state: TemporalState<IVideoGenerateFormStore>) => T,
  equality?: (a: T, b: T) => boolean,
) =>
  useStoreWithEqualityFn(
    useVideoGenerateFormStore.temporal,
    selector,
    equality,
  );

export const useVideoGenerateFilesStore = create<IVideoGenerateFilesStore>(
  set => ({
    audio: null,
    background: null,
    set,
  }),
);
