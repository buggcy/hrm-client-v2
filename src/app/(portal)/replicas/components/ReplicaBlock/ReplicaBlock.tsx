import Link from 'next/link';

import { ArrowRightIcon, UserPlusIcon } from 'lucide-react';

import { LoadingButton } from '@/components/LoadingButton';
import { ReplicaCard } from '@/components/ReplicaCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { IReplica } from '@/types';

const SkeletonReplicaCard = () => (
  <Card className="rounded-md">
    <CardContent className="p-4">
      <Skeleton className="aspect-video size-full rounded-md" />
    </CardContent>
    <div className="flex flex-col gap-3 px-2.5 pb-4">
      <Skeleton className="h-8 w-full rounded-md" />
      <Skeleton className="h-5 w-full rounded-md" />
    </div>
  </Card>
);

const ReplicaBlock = ({
  title,
  isMuted,
  replicas,
  isLoading,
  isPersonalReplicas,
  isFetchingNextPage,
  onLoadMore,
  toggleMute,
  onMuteChange,
}: {
  title: string;
  isMuted: boolean;
  replicas?: IReplica[];
  isLoading: boolean;
  isPersonalReplicas?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
  toggleMute: () => void;
  onMuteChange: (isMuted: boolean) => void;
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">
        {title}{' '}
        {!!replicas?.length && (
          <span className="text-muted-foreground">({replicas?.length})</span>
        )}
      </h3>
      {isLoading && (
        <div className="grid grid-cols-[repeat(auto-fill,_minmax(276px,_1fr))] gap-6">
          <SkeletonReplicaCard />
          <SkeletonReplicaCard />
          <SkeletonReplicaCard />
          <SkeletonReplicaCard />
        </div>
      )}
      {replicas?.length === 0 && isPersonalReplicas && (
        <Card>
          <CardContent>
            <div className="flex flex-col items-center gap-4 py-14 text-center">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary-foreground">
                <UserPlusIcon className="size-4 text-primary" />
              </div>
              <p className="max-w-[30ch] text-muted-foreground">
                Create your first personal replica with
                <span className="font-medium text-foreground">
                  {' '}
                  just 2 minutes{' '}
                </span>
                of recording!
              </p>
              <Button variant="link" asChild size="sm">
                <Link href="/replicas/create">
                  Create Replica <ArrowRightIcon className="inline size-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      {!!replicas?.length && (
        <div className="mb-6 grid grid-cols-[repeat(auto-fill,_minmax(276px,_1fr))] gap-6">
          {replicas.map(replica => (
            <ReplicaCard
              isMuted={isMuted}
              toggleMute={toggleMute}
              onMuteChange={onMuteChange}
              key={replica.replica_id}
              replica={replica}
            />
          ))}
        </div>
      )}
      {replicas?.length && onLoadMore && (
        <div className="flex justify-center">
          <LoadingButton loading={!!isFetchingNextPage} onClick={onLoadMore}>
            Load More
          </LoadingButton>
        </div>
      )}
    </div>
  );
};

export { ReplicaBlock };
