import { temporal } from 'zundo';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DEFAULT_REPLICA } from '@/app/(portal)/videos/create/constants';

import { IPersona, IReplica } from '@/types';

export enum TTS_ENGINE {
  ELEVENLABS = 'elevenlabs',
  PLAYHT = 'playht',
  CARTESIA = 'cartesia',
  DEFAULT = 'default',
}

export enum LLM_ENGINE {
  TAVUS_LLAMA = 'tavus-llama',
  TAVUS_GPT_4O = 'tavus-gpt-4o',
  TAVUS_GPT_4O_MINI = 'tavus-gpt-4o-mini',
  CUSTOM = 'custom',
}

export interface ICreatePersonaFormStore {
  replicaId: IReplica['replica_id'];
  name?: IPersona['persona_name'];
  systemPrompt: IPersona['system_prompt'];
  context?: IPersona['context'];
  enableVision: boolean;
  ttsEngine?: TTS_ENGINE;
  ttsVoiceId?: string;
  ttsApiKey?: string;
  llmName?: LLM_ENGINE;
  customLLM?: string;
  llmApiKey?: string;
  llmApiUrl?: string;
  set: (state: Partial<ICreatePersonaFormStore>) => void;
}

export const useCreatePersonaFormStore = create<ICreatePersonaFormStore>()(
  persist(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-call
    temporal(set => ({
      systemPrompt: '',
      enableVision: true,
      replicaId: DEFAULT_REPLICA.replica_id,
      set,
    })),
    {
      name: 'useCreatePersonaFormStore',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
