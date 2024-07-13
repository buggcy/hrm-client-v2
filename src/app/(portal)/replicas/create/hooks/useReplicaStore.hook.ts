import { create, StoreApi } from 'zustand';

export enum VideoMethod {
  UPLOAD = 'upload',
  RECORD = 'record',
}

export type State = {
  activeStep: 'intro' | 'consent' | 'training';
  consentMethod: VideoMethod;
  trainingMethod: VideoMethod;
  completedSteps: {
    intro: boolean;
    consent: boolean;
    training: boolean;
  };
  consentFile: {
    file: File | null;
    url: string;
  } | null;
  consentRecordFile: {
    file: File | null;
    url: string;
  } | null;
  consentURL?: string;
  trainingFile: {
    file: File | null;
    url: string;
  } | null;
  trainingRecordFile: {
    file: File | null;
    url: string;
  } | null;
  trainingURL?: string;
};

type Action = {
  setActiveStep: (value: State['activeStep']) => void;
  completeStep: (step: keyof State['completedSteps']) => void;
  incompleteStep: (step: keyof State['completedSteps']) => void;
  set: StoreApi<State>['setState'];
};

export const useReplicaStore = create<State & Action>(set => ({
  activeStep: 'intro',
  consentMethod: VideoMethod.RECORD,
  trainingMethod: VideoMethod.RECORD,
  completedSteps: {
    intro: false,
    consent: false,
    training: false,
  },
  consentFile: null,
  consentRecordFile: null,
  trainingFile: null,
  trainingRecordFile: null,
  setActiveStep: value => set({ activeStep: value }),
  completeStep: step => {
    set(state => ({
      completedSteps: {
        ...state.completedSteps,
        [step]: true,
      },
    }));
  },
  incompleteStep: step => {
    set(state => ({
      completedSteps: {
        ...state.completedSteps,
        [step]: false,
      },
    }));
  },
  set,
}));
