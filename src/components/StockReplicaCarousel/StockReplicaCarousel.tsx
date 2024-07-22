'use client';
import { useMemo } from 'react';

import { ChevronRight } from 'lucide-react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

import { useReplicasQuery } from '@/hooks';

import { ReplicaCard, useReplicasVideoMute } from '../ReplicaCard';
import { Card, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

import { IReplica, ReplicaStatus, ReplicaType } from '@/types';

export const StockReplicaCarousel: React.FC = () => {
  // TODO: ADD query param when it will be implemented and remove useMemo
  const { data: replicas, isLoading } = useReplicasQuery({
    queryParams: {
      limit: 10,
      replica_type: ReplicaType.STUDIO,
    },
    refetchInterval: false,
  });
  const { isMuted, toggleMute, onMuteChange } = useReplicasVideoMute();

  const studioReplicas: IReplica[] | undefined = useMemo(() => {
    return (
      // @ts-expect-error
      replicas?.pages
        // @ts-expect-error
        ?.map(page => page.data)
        ?.flat()
        // @ts-expect-error
        ?.filter(replica => replica.status === ReplicaStatus.COMPLETED)
    );
  }, [replicas]);

  return (
    <div className="mt-8 w-full rounded-md">
      <h2 className="mb-4 flex items-center text-lg font-semibold">
        Try stock replica <ChevronRight className="ml-0.5 size-5" />
      </h2>
      <div className="relative">
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="relative w-full"
        >
          <CarouselPrevious className="absolute -top-8 left-auto right-10" />
          <CarouselNext className="absolute -top-8 left-auto right-0" />
          <CarouselContent>
            {isLoading && (
              <>
                <CarouselItem className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <Card className="rounded-md">
                    <CardContent className="p-4">
                      <Skeleton className="aspect-video size-full rounded-md" />
                    </CardContent>
                    <div className="flex flex-col gap-3 px-2.5 pb-4">
                      <Skeleton className="h-8 w-full rounded-md" />
                      <Skeleton className="h-5 w-full rounded-md" />
                    </div>
                  </Card>
                </CarouselItem>
                <CarouselItem className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <Card className="rounded-md">
                    <CardContent className="p-4">
                      <Skeleton className="aspect-video size-full rounded-md" />
                    </CardContent>
                    <div className="flex flex-col gap-3 px-2.5 pb-4">
                      <Skeleton className="h-8 w-full rounded-md" />
                      <Skeleton className="h-5 w-full rounded-md" />
                    </div>
                  </Card>
                </CarouselItem>
              </>
            )}
            {studioReplicas?.map(replica => (
              <CarouselItem
                key={replica.replica_id}
                className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <ReplicaCard
                  isMuted={isMuted}
                  toggleMute={toggleMute}
                  onMuteChange={onMuteChange}
                  key={replica.replica_id}
                  replica={replica}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};
