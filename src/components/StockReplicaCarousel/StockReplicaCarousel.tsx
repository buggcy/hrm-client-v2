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

import {
  ReplicaCard,
  SkeletonReplicaCard,
  useReplicasVideoMute,
} from '../ReplicaCard';

import { ReplicaStatus, ReplicaType } from '@/types';

export const StockReplicaCarousel: React.FC = () => {
  const { data: replicas, isLoading } = useReplicasQuery({
    queryParams: {
      limit: 10,
      replica_type: ReplicaType.STUDIO,
    },
    refetchInterval: false,
  });
  const { isMuted, toggleMute, onMuteChange } = useReplicasVideoMute();

  const studioReplicas = useMemo(() => {
    return replicas?.pages
      ?.map(page => page.data)
      ?.flat()
      ?.filter(replica => replica.status === ReplicaStatus.COMPLETED);
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
                  <SkeletonReplicaCard />
                </CarouselItem>
                <CarouselItem className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <SkeletonReplicaCard />
                </CarouselItem>
                <CarouselItem className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <SkeletonReplicaCard />
                </CarouselItem>
                <CarouselItem className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <SkeletonReplicaCard />
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
