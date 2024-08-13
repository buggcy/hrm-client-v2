'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ChevronRight } from 'lucide-react';

import { LoadingButton } from '@/components/LoadingButton';
import { SkeletonReplicaCard } from '@/components/ReplicaCard';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';

import { useCreateConversationMutation, useReplicaQuery } from '@/hooks';
import { PersonasDescriptions, usePersonasQuery } from '@/hooks/usePersonas';
import { cn, createReplicaThumbnailUrl } from '@/utils';

import { IPersona, PersonaType } from '@/types';

const PersonaCard = ({
  persona,
  selected,
  isSelectable,
  handleSelect,
  onClick,
  isLoading,
}: {
  persona: IPersona;
  selected?: boolean;
  isSelectable?: boolean;
  handleSelect?: () => void;
  onClick: (id: IPersona['persona_id']) => void;
  isLoading?: boolean;
}) => {
  const { data: replica } = useReplicaQuery(persona.default_replica_id!, {
    refetchOnMount: false,
  });

  return (
    <Card
      className={cn(
        'group flex h-full flex-col justify-between rounded-md p-4 outline-primary hover:shadow',
        {
          'ring ring-primary': selected,
          'cursor-pointer': isSelectable,
        },
      )}
      onClick={handleSelect}
    >
      <CardContent className="flex flex-col gap-4 p-0">
        {replica ? (
          <Avatar className="size-14">
            <video
              className="aspect-video size-full rounded-md bg-black object-cover"
              muted
              crossOrigin="anonymous"
            >
              <source
                src={createReplicaThumbnailUrl(replica.thumbnail_video_url)}
                type="video/mp4"
              />
            </video>
          </Avatar>
        ) : (
          <Skeleton className="aspect-video size-14 rounded-full" />
        )}
        <div>
          <h3 className="text-lg font-semibold">{persona.persona_name}</h3>
          <p className="text-sm font-medium text-muted-foreground">
            {PersonasDescriptions[persona.persona_id]}
          </p>
        </div>
      </CardContent>
      <CardFooter className="mt-4 flex flex-col content-start items-start p-0">
        <LoadingButton
          variant="outline"
          loading={isLoading!}
          disabled={isLoading}
          onClick={() => onClick(persona.persona_id)}
        >
          Join Now
        </LoadingButton>
      </CardFooter>
    </Card>
  );
};

export const StockPersonasCarousel = () => {
  const router = useRouter();
  const { data: personas, isLoading } = usePersonasQuery({
    queryParams: {
      persona_type: PersonaType.STUDIO,
    },
    refetchInterval: false,
  });
  const { mutateAsync, isPending } = useCreateConversationMutation();

  const handleJoin = (id: IPersona['persona_id']) => {
    toast({
      variant: 'progress',
      title: 'Creating conversation...',
      description: 'Please wait while we create a conversation for you.',
    });

    mutateAsync({
      persona_id: id,
    })
      .then(data => {
        window.open(data.conversation_url, '_blank');
        router.push('/conversations/create?personaId=' + id);
      })
      .catch(() => {
        toast({
          variant: 'error',
          title: 'Error',
          description:
            'Failed to create conversation. Please try again later, or contact support.',
        });
      });
  };

  return (
    <div className="w-full rounded-md">
      <Button variant="link" className="p-0 text-foreground" asChild>
        <Link href="/conversations/create">
          <h2 className="mb-4 flex items-center text-lg font-semibold">
            Chat with our stock replica personas{' '}
            <ChevronRight className="ml-0.5 size-5" />
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
            {personas?.data
              ?.filter(persona => !!PersonasDescriptions[persona.persona_id])
              .map(persona => (
                <CarouselItem
                  key={persona.persona_id}
                  className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <PersonaCard
                    persona={persona}
                    isLoading={isPending}
                    onClick={handleJoin}
                  />
                </CarouselItem>
              ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};
