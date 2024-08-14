'use client';
import { FC, useState } from 'react';

import { useReplicaQuery } from '@/hooks';
import { cn, createReplicaThumbnailUrl } from '@/utils';

import { IPersona } from '@/types';

export const PersonaThumbnail: FC<{
  replica_id: IPersona['default_replica_id'];
  className?: string;
}> = ({ replica_id, className }) => {
  const [isError, setIsError] = useState(false);
  const { data: replica } = useReplicaQuery(replica_id as string, {
    enabled: !!replica_id,
  });

  if (!replica_id) return null;

  const { thumbnail_video_url } = replica || {};

  if (!thumbnail_video_url) return null;

  return (
    <div
      className={cn(
        'flex h-60 items-center justify-center rounded-md border',
        className,
      )}
    >
      {thumbnail_video_url &&
        (isError ? null : (
          <video
            className="aspect-video w-full rounded-md bg-black"
            muted
            preload="metadata"
            controls={false}
            onError={() => setIsError(true)}
          >
            <source
              src={createReplicaThumbnailUrl(thumbnail_video_url)}
              type="video/mp4"
            />
          </video>
        ))}
    </div>
  );
};
