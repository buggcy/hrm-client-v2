import React from 'react';

import { LucideProps } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';

export const SkeletonList = () => (
  <>
    <Skeleton className="m-2 min-h-16 w-full rounded-md" />
    <Skeleton className="m-2 min-h-16 w-full rounded-md" />
    <Skeleton className="m-2 min-h-16 w-full rounded-md" />
    <Skeleton className="m-2 min-h-16 w-full rounded-md" />
  </>
);

export const EmptyList = ({
  Icon,
  title,
}: {
  Icon: React.FC<LucideProps>;
  title: string;
}) => (
  <div className="flex h-full flex-col content-center items-center justify-center gap-4 p-5">
    <div className="flex items-center justify-center rounded-full bg-accent p-3 text-muted-foreground">
      <Icon size={16} />
    </div>
    <p className="text-center text-sm font-medium text-muted-foreground">
      {title}
    </p>
  </div>
);
