import { z } from 'zod';

export enum PersonaType {
  STUDIO = 'system',
  PERSONAL = 'user',
}

export const IPersona = z.object({
  persona_id: z.string(),
  persona_name: z.string(),
  default_replica_id: z.string().nullish(),
  context: z.string().nullish(),
  system_prompt: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  persona_type: z.nativeEnum(PersonaType).nullish().default(PersonaType.STUDIO),
});
export type IPersona = z.infer<typeof IPersona>;
