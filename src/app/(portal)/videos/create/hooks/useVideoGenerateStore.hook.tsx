import { temporal, TemporalState } from 'zundo';
import { create, StoreApi } from 'zustand';
import { persist } from 'zustand/middleware';
import { useStoreWithEqualityFn } from 'zustand/traditional';

import { DEFAULT_REPLICA } from '@/app/(portal)/videos/create/components/ReplicaSelect';

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
  isAdvancedSettingsAccordionOpen: boolean;
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
  backgroundUrl?: string;
  backgroundSourceUrl?: string;
  type: VideoGenerationType;
  set: StoreApi<IVideoGenerateFormStore>['setState'];
}

export const useVideoGenerateFormStore = create<IVideoGenerateFormStore>()(
  persist(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-call
    temporal(set => ({
      replicaId: DEFAULT_REPLICA.replica_id,
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
    isAdvancedSettingsAccordionOpen: false,
    audioTab: AudioTab.UPLOAD,
    audio: null,
    background: null,
    set,
  }),
);
