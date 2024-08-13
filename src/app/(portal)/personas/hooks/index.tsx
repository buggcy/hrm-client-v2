import { temporal } from 'zundo';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DEFAULT_REPLICA } from '@/app/(portal)/videos/create/constants';

import { IPersona, IReplica } from '@/types';

export interface ICreatePersonaFormStore {
  replicaId: IReplica['replica_id'];
  name?: IPersona['persona_name'];
  systemPrompt: IPersona['system_prompt'];
  context?: IPersona['context'];
  set: (state: Partial<ICreatePersonaFormStore>) => void;
}

export const useCreatePersonaFormStore = create<ICreatePersonaFormStore>()(
  persist(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-call
    temporal(set => ({
      systemPrompt: '',
      replicaId: DEFAULT_REPLICA.replica_id,
      set,
    })),
    {
      name: 'useCreatePersonaFormStore',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
