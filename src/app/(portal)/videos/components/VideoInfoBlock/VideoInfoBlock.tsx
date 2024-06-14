import { FC } from 'react';

import { Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { cn } from '@/utils';

import { CopyRequestID } from '../CopyRequestID/CopyRequestID';

import { IVideo, VideoStatus } from '@/types';

export const VideoInfoBlock: FC<{
  video_id?: IVideo['video_id'];
  created_at?: IVideo['created_at'];
  status?: IVideo['status'];
  video_name?: IVideo['video_name'];
}> = ({ video_id, created_at, status, video_name }) => {
  return (
    <div>
      <div className="mb-4 flex w-full items-start">
        <p className="font-semibold text-foreground">{video_name}</p>
        <Button variant="ghost" size="icon" className="ml-2.5 size-6 p-0">
          <Pencil className="size-3.5" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-full max-w-38.5">
            <p className="text-sm font-semibold">Video ID</p>
          </div>
          <div>
            <CopyRequestID id={video_id} />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-full max-w-38.5">
            <p className="text-sm font-semibold">Created</p>
          </div>
          <div>
            <p className="text-sm font-medium">
              {created_at?.toLocaleString('default', {
                month: 'long',
              })}{' '}
              {created_at?.getDate()},{' '}
              {created_at?.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-full max-w-38.5">
            <p className="text-sm font-semibold">Status</p>
          </div>
          <div>
            <p
              className={cn('text-sm font-medium capitalize', {
                'text-success': status === VideoStatus.READY,
                'text-error': status === VideoStatus.ERROR,
                'text-progress': status === VideoStatus.GENERATING,
              })}
            >
              {status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
