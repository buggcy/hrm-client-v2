'use client';
import {
  ConversationDetailsSheet,
  useConversationDetailsSheet,
} from '../ConversationDetailsSheet/ConversationDetailsSheet';

export const ConversationDetailsSheetWrapper = () => {
  const { conversationId, onOpenChange } = useConversationDetailsSheet();

  return (
    <ConversationDetailsSheet id={conversationId} onOpenChange={onOpenChange} />
  );
};
