import { temporal } from 'zundo';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DEFAULT_REPLICA } from '@/app/(portal)/videos/create/constants';

import { IPersona, IReplica } from '@/types';

export interface ICreateConversationFormStore {
  replicaId: IReplica['replica_id'];
  personaId?: IPersona['persona_id'];
  webhookUrl?: string;
  name?: string;
  context?: string;
  set: (state: Partial<ICreateConversationFormStore>) => void;
}

export const useCreateConversationFormStore =
  create<ICreateConversationFormStore>()(
    persist(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-call
      temporal(set => ({
        replicaId: DEFAULT_REPLICA.replica_id,
        set,
      })),
      {
        name: 'useCreateConversationFormStore',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  );
