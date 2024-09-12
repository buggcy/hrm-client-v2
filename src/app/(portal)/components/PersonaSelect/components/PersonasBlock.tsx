import Link from 'next/link';

import { LoadingButton } from '@/components/LoadingButton';
import { Button } from '@/components/ui/button';

import { PersonaCard } from './PersonaCard';

import { IPersona } from '@/types';

export const PersonasBlock = ({
  label,
  personas,
  selectedPersonaId,
  setSelectedPersonaId,
  withCreateButton,
  onLoadMore,
  isFetchingNextPage,
  total,
}: {
  label: string;
  personas?: IPersona[];
  selectedPersonaId?: string;
  setSelectedPersonaId: (id?: string) => void;
  withCreateButton?: boolean;
  onLoadMore?: () => void;
  isFetchingNextPage?: boolean;
  total?: number;
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {label} {total && `(${total})`}
        </h3>
        {withCreateButton && (
          <Button variant="link" className="text-primary" asChild>
            <Link href="/personas/create">+ Create Persona</Link>
          </Button>
        )}
      </div>
      <ul className="flex flex-col gap-4">
        {personas?.map(persona => (
          <li key={persona.persona_id}>
            <PersonaCard
              persona={persona}
              isSelected={selectedPersonaId === persona.persona_id}
              onClick={setSelectedPersonaId}
            />
          </li>
        ))}
      </ul>
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
