import { FC } from 'react';

import MuxPlayer from '@mux/mux-player-react';
import { AlertTriangle, Loader } from 'lucide-react';

import { cn } from '@/utils';

import { IVideo, VideoStatus } from '@/types';

export const VideoBlock: FC<{
  status?: IVideo['status'];
  stream_url?: IVideo['stream_url'];
  status_details?: IVideo['status_details'];
  className?: string;
}> = ({ status, stream_url, status_details, className }) => {
  return (
    <div
      className={cn(
        'flex h-60 items-center justify-center rounded-md border',
        className,
      )}
    >
      {status === VideoStatus.READY && stream_url && (
        <MuxPlayer src={stream_url} className="h-[inherit]" />
      )}
      {status === VideoStatus.READY && !stream_url && (
        <div className="flex flex-col items-center justify-center p-4">
          <div className="mb-2 rounded-full bg-error-foreground p-2">
            <AlertTriangle className="size-5 text-error" />
          </div>
          <p className="mb-1 text-sm font-semibold">Something went wrong...</p>
        </div>
      )}
      {status === VideoStatus.GENERATING && (
        <div className="flex flex-col items-center justify-center p-4">
          <div className="mb-2 rounded-full bg-progress-foreground p-2">
            <Loader className="size-5 text-progress" />
          </div>
          <p className="mb-1 text-sm font-semibold">Generating...</p>
        </div>
      )}
      {status === VideoStatus.ERROR && (
        <div className="flex flex-col items-center justify-center p-4">
          <div className="mb-2 rounded-full bg-error-foreground p-2">
            <AlertTriangle className="size-5 text-error" />
          </div>
          <p className="mb-1 text-sm font-semibold">Something went wrong...</p>
          <p className="text-center text-sm">{status_details}</p>
        </div>
      )}
      {status === VideoStatus.DELETED && (
        <div className="flex flex-col items-center justify-center p-4">
          <div className="mb-2 rounded-full bg-error-foreground p-2">
            <AlertTriangle className="size-5 text-error" />
          </div>
          <p className="mb-1 text-sm font-semibold">Deleted</p>
        </div>
      )}
    </div>
  );
};
