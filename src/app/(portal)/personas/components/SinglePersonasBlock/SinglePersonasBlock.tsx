import { useRouter } from 'next/navigation';

import { PersonaCard } from '@/components/PersonaCard';
import { toast } from '@/components/ui/use-toast';

import { useCreateConversationMutation } from '@/hooks';

import { IPersona } from '@/types';

const SinglePersonasBlock = ({
  title,
  persona,
  onOpenDetails,
}: {
  title: string;
  persona?: IPersona;
  total?: number;
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
      <h3 className="font-semibold">{title} </h3>
      {!!persona && (
        <div className="mb-6 grid grid-cols-[repeat(auto-fill,_minmax(302px,_1fr))] gap-6">
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
        </div>
      )}
    </div>
  );
};

export { SinglePersonasBlock };
