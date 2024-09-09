'use client';

import { useMemo } from 'react';
import Link from 'next/link';

import { LoadingButton } from '@/components/LoadingButton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

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

  const personaInitials = useMemo(() => {
    return persona.persona_name
      ?.split(' ')
      .slice(0, 2)
      .map(word => word[0])
      .join('');
  }, [persona.persona_name]);

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
        <Avatar className="size-14">
          {replica?.thumbnail_video_url ? (
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
          ) : (
            <AvatarFallback>{personaInitials}</AvatarFallback>
          )}
        </Avatar>
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
        {persona.default_replica_id && (
          <LoadingButton
            variant="outline"
            loading={isLoading!}
            disabled={isLoading}
            onClick={handleClick}
          >
            Join Now
          </LoadingButton>
        )}
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
