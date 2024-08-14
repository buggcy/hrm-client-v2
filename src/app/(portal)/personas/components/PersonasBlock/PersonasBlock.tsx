import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ArrowRightIcon, UserPlusIcon } from 'lucide-react';

import { LoadingButton } from '@/components/LoadingButton';
import { PersonaCard } from '@/components/PersonaCard';
import { SkeletonReplicaCard } from '@/components/ReplicaCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

import { useCreateConversationMutation } from '@/hooks';

import { IPersona } from '@/types';

const PersonasBlock = ({
  title,
  personas,
  isLoading,
  isPersonalPersonas,
  isFetchingNextPage,
  total,
  onLoadMore,
  onOpenDetails,
}: {
  title: string;
  personas?: IPersona[];
  isLoading: boolean;
  isPersonalPersonas?: boolean;
  isFetchingNextPage?: boolean;
  total?: number;
  onLoadMore?: () => void;
  onOpenDetails?: (id: IPersona['persona_id']) => void;
}) => {
  const router = useRouter();
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
        router.push('/conversations/?conversation_id=' + data.conversation_id);
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
    <div className="space-y-4">
      <h3 className="font-semibold">
        {title}{' '}
        {!!personas?.length && (
          <span className="text-muted-foreground">
            ({total || personas?.length})
          </span>
        )}
      </h3>
      {isLoading && (
        <div className="grid grid-cols-[repeat(auto-fill,_minmax(302px,_1fr))] gap-6">
          <SkeletonReplicaCard />
          <SkeletonReplicaCard />
          <SkeletonReplicaCard />
          <SkeletonReplicaCard />
        </div>
      )}
      {personas?.length === 0 && isPersonalPersonas && (
        <Card>
          <CardContent>
            <div className="flex flex-col items-center gap-4 py-14 text-center">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary-foreground">
                <UserPlusIcon className="size-4 text-primary" />
              </div>
              <p className="max-w-[30ch] text-muted-foreground">
                Create your first personal persona
              </p>
              <Button variant="link" asChild size="sm">
                <Link href="/personas/create">
                  Create Persona <ArrowRightIcon className="inline size-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      {!!personas?.length && (
        <div className="mb-6 grid grid-cols-[repeat(auto-fill,_minmax(302px,_1fr))] gap-6">
          {personas.map(persona => (
            <PersonaCard
              key={persona.persona_id}
              persona={persona}
              isSelectable={true}
              isLoading={isPending}
              onClick={handleJoin}
              handleSelect={() => {
                onOpenDetails?.(persona.persona_id);
              }}
            />
          ))}
        </div>
      )}
      {!!personas?.length && onLoadMore && (
        <div className="flex justify-center">
          <LoadingButton
            variant="outline"
            loading={!!isFetchingNextPage}
            onClick={onLoadMore}
          >
            Load More
          </LoadingButton>
        </div>
      )}
    </div>
  );
};

export { PersonasBlock };
