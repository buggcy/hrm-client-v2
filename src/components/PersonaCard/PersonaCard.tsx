'use client';

import Link from 'next/link';

import { LoadingButton } from '@/components/LoadingButton';
import { Avatar } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { useReplicaQuery } from '@/hooks';
import { PersonasDescriptions } from '@/hooks/usePersonas';
import { cn, createReplicaThumbnailUrl } from '@/utils';

import { Button } from '../ui/button';

import { IPersona } from '@/types';

export const PersonaCard = ({
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

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(persona.persona_id);
  };

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
          <h3 className="truncate text-lg font-semibold">
            {persona.persona_name}
          </h3>
          <p className="text-sm font-medium text-muted-foreground">
            {PersonasDescriptions[persona.persona_id]}
          </p>
        </div>
      </CardContent>
      <CardFooter className="mt-4 flex content-start items-start gap-2 p-0">
        <LoadingButton
          variant="outline"
          loading={isLoading!}
          disabled={isLoading}
          onClick={handleClick}
        >
          Join Now
        </LoadingButton>
        <Button variant="primary-inverted" asChild>
          <Link
            href={`/conversations/create?personaId=${persona.persona_id}`}
            onClick={e => e.stopPropagation()}
            prefetch={false}
          >
            Setup Conversation
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
