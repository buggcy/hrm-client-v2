import React from 'react';

import { Loader } from 'lucide-react';

import { createReplicaThumbnailUrl } from '@/utils';

export const ReplicaPreviewContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div className="pointer-events-none relative flex h-full items-center justify-center overflow-hidden rounded">
    {children}
  </div>
);

export const ReplicaPreviewBadge = () => (
  <div className="absolute inset-x-0 bottom-4 z-20 flex items-center justify-center">
    <p className="flex w-max items-center space-x-2 rounded-md bg-blur-background px-4 py-2 text-center text-sm font-medium text-white/90 backdrop-blur-sm">
      In preview mode, sound and face animations are off
    </p>
  </div>
);

export const ReplicaPreview = ({ src }: { src?: string }) => (
  <ReplicaPreviewContainer>
    <Loader className="absolute z-0 mb-6 size-8 animate-spin" />
    <div className="relative z-10 h-full rounded-md border bg-secondary">
      <video
        className="aspect-video h-[inherit] rounded"
        preload="auto"
        src={createReplicaThumbnailUrl(src)}
        crossOrigin="anonymous"
      />
    </div>
    <ReplicaPreviewBadge />
  </ReplicaPreviewContainer>
);
