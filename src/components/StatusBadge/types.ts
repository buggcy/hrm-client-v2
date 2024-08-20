import { ConversationStatus, ReplicaStatus, VideoStatus } from '@/types';

export interface StatusBadgeProps {
  status: VideoStatus | ReplicaStatus | ConversationStatus;
  progress?: string;
}
