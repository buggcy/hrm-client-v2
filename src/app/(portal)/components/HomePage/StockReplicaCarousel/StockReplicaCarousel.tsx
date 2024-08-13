'use client';

import { useMemo } from 'react';
import Link from 'next/link';

import { ChevronRight } from 'lucide-react';

import {
  ReplicaCard,
  SkeletonReplicaCard,
  useReplicasVideoMute,
} from '@/components/ReplicaCard';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

import { useReplicasQuery } from '@/hooks';

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
    <div className="w-full rounded-md">
      <Button variant="link" className="p-0 text-foreground" asChild>
        <Link href="/videos/create">
          <h2 className="mb-4 flex items-center text-lg font-semibold">
            Try stock replica <ChevronRight className="ml-0.5 size-5" />
          </h2>
        </Link>
      </Button>
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
