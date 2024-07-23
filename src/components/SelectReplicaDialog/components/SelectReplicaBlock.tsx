import Link from 'next/link';

import { ArrowRightIcon, UserPlusIcon } from 'lucide-react';

import { LoadingButton } from '@/components/LoadingButton';
import { ReplicaCard } from '@/components/ReplicaCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { IReplica } from '@/types';

const SelectReplicaBlock = ({
  title,
  isMuted,
  replicas,
  isLoading,
  selectedReplicaId,
  onSelect,
  isPersonalReplicas,
  toggleMute,
  onMuteChange,
  onLoadMore,
  isFetchingNextPage,
}: {
  title: string;
  isMuted: boolean;
  replicas?: IReplica[];
  isLoading: boolean;
  selectedReplicaId?: IReplica['replica_id'];
  onSelect: (replica: IReplica) => void;
  isPersonalReplicas?: boolean;
  toggleMute: () => void;
  onMuteChange: (isMuted: boolean) => void;
  onLoadMore?: () => void;
  isFetchingNextPage?: boolean;
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">
        {title}{' '}
        {!!replicas?.length && (
          <span className="text-muted-foreground">({replicas?.length})</span>
        )}
      </h3>
      {isLoading && (
        <div className="grid grid-cols-[repeat(auto-fill,_minmax(276px,_1fr))] gap-6">
          <Card className="rounded-md">
            <CardContent className="aspect-video p-4">
              <Skeleton className="size-full rounded-md" />
            </CardContent>
          </Card>
          <Card className="rounded-md">
            <CardContent className="aspect-video p-4">
              <Skeleton className="size-full rounded-md" />
            </CardContent>
          </Card>
          <Card className="rounded-md">
            <CardContent className="aspect-video p-4">
              <Skeleton className="size-full rounded-md" />
            </CardContent>
          </Card>
          <Card className="rounded-md">
            <CardContent className="aspect-video p-4">
              <Skeleton className="size-full rounded-md" />
            </CardContent>
          </Card>
        </div>
      )}
      <div className="mb-6 grid grid-cols-[repeat(auto-fill,_minmax(276px,_1fr))] gap-6">
        {isPersonalReplicas && (
          <Card>
            <CardContent className="p-0">
              <div className="flex flex-col items-center gap-4 py-14 text-center">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary-foreground">
                  <UserPlusIcon className="size-4 text-primary" />
                </div>
                <Button variant="link" asChild size="sm">
                  <Link href="/replicas/create">
                    Create Replica <ArrowRightIcon className="inline size-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        {!!replicas?.length &&
          replicas.map(replica => (
            <ReplicaCard
              isSelectable
              isMuted={isMuted}
              toggleMute={toggleMute}
              onMuteChange={onMuteChange}
              key={replica.replica_id}
              replica={replica}
              onSelect={onSelect}
              selected={selectedReplicaId === replica.replica_id}
            />
          ))}
      </div>
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

export { SelectReplicaBlock };
