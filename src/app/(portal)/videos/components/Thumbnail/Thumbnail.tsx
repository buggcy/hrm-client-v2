import { Loader, Trash2, TriangleAlert, Video } from 'lucide-react';

import { IVideo, VideoStatus } from '@/types';

const getIcon = (
  status: VideoStatus,
  generation_progress?: IVideo['generation_progress'],
) => {
  switch (status) {
    case VideoStatus.QUEUED:
      return <Loader className="size-6 animate-spin-slow text-progress" />;
    case VideoStatus.GENERATING:
      return generation_progress ? (
        <span className="text-base text-progress">
          {generation_progress.split('/')[0]}%
        </span>
      ) : (
        <Loader className="size-6 text-progress" />
      );
    case VideoStatus.ERROR:
      return <TriangleAlert className="size-6 text-destructive" />;
    case VideoStatus.READY:
      return <Video className="size-6" />;
    case VideoStatus.DELETED:
      return <Trash2 className="size-6 text-destructive" />;
    default:
      return <Video className="size-6" />;
  }
};

export const Thumbnail = ({
  src,
  status,
  progress,
  video_name,
}: {
  src: IVideo['still_image_thumbnail_url'];
  status: IVideo['status'];
  progress: IVideo['generation_progress'];
  video_name: IVideo['video_name'];
}) => {
  return src ? (
    <img
      src={src}
      alt={video_name || 'Video thumbnail'}
      className="max-h-13.5 object-contain"
    />
  ) : (
    getIcon(status, progress)
  );
};
