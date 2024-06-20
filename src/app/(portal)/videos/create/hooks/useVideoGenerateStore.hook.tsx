import { temporal, TemporalState } from 'zundo';
import { create, StoreApi } from 'zustand';
import { persist } from 'zustand/middleware';
import { useStoreWithEqualityFn } from 'zustand/traditional';

import { AudioTab, VideoGenerationType } from '../types';

import { IReplica } from '@/types';

export interface IVideoGenerateStore {
  audioTab: AudioTab;
  audio: {
    file?: File;
    url: string;
    duration?: number;
  } | null;
  background: {
    file?: File;
    url: string;
  } | null;
  set: StoreApi<IVideoGenerateStore>['setState'];
}

export type Require<T> = {
  [P in keyof T]-?: T[P];
};

export interface IVideoGenerateFormStore {
  replicaId: IReplica['replica_id'];
  script?: string;
  audioUrl?: string;
  name?: string;
  callbackUrl?: string;
  type: VideoGenerationType;
  set: StoreApi<IVideoGenerateFormStore>['setState'];
}

export const useVideoGenerateFormStore = create<IVideoGenerateFormStore>()(
  persist(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-call
    temporal(set => ({
      replicaId: '1',
      type: VideoGenerationType.SCRIPT,
      set,
    })),
    { name: 'useVideoFormStore' },
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

export const useVideoGenerateMetadataStore = create<IVideoGenerateStore>(
  set => ({
    isValid: false,

    audioTab: AudioTab.UPLOAD,
    audio: null,
    background: null,
    set,
  }),
);
