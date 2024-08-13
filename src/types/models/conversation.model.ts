import { z } from 'zod';

export enum ConversationStatus {
  ACTIVE = 'active',
  ENDED = 'ended',
  ERROR = 'error',
}

// TODO: VERIFY THIS SCHEMA
export const IConversation = z.object({
  conversation_id: z.string(),
  conversation_name: z.string(),
  status: z.nativeEnum(ConversationStatus),
  conversation_url: z.string().url(),
  replica_id: z.string().nullish(),
  persona_id: z.string().nullish(),
  created_at: z.string(),
});
export type IConversation = z.infer<typeof IConversation>;
