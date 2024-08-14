import { IPersona } from '@/types';

export type PersonaId = IPersona['persona_id'] | null;
export type OnOpenChange = (id?: PersonaId) => void;

export interface PersonaDetailsSheetProps {
  id: PersonaId;
  onOpenChange: OnOpenChange;
}
