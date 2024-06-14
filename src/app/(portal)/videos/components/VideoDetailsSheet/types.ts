import { IVideo } from '@/types';

export type VideoId = IVideo['video_id'] | null;
export type OnOpenChange = (id?: VideoId) => void;

export interface VideoDetailsSheetProps {
  id: VideoId;
  onOpenChange: OnOpenChange;
}
