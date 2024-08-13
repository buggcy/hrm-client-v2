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
  <p className="absolute bottom-4 left-1/2 z-20 flex w-max -translate-x-1/2 items-center space-x-2 rounded-md bg-white/10 px-4 py-2 text-center text-sm font-medium text-white text-opacity-80 backdrop-blur-sm">
    In preview mode, sound and face animations are off
  </p>
);

export const ReplicaPreview = ({ src }: { src?: string }) => (
  <ReplicaPreviewContainer>
    <Loader className="absolute z-0 mb-6 size-8 animate-spin" />
    <div className="relative z-10 h-full">
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
