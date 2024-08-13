import { IConversation } from '@/types';

export type ConversationId = IConversation['conversation_id'] | null;
export type OnOpenChange = (id?: ConversationId) => void;

export interface ConversationDetailsSheetProps {
  id: ConversationId;
  onOpenChange: OnOpenChange;
}
