'use client';

import { useState } from 'react';

import { Loader } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

import { usePersonaQuery } from '@/hooks/usePersonas';

import { IPersona } from '@/types';

export const GetPersonaByIdInput = ({
  setSearchResult,
}: {
  setSearchResult: (persona: IPersona | null) => void;
}) => {
  const [personaId, setPersonaId] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 8) return;
    if (event.target.value.length === 0) {
      setSearchResult(null);
    }

    setPersonaId(event.target.value);
  };

  const {
    data: persona,
    refetch,
    isFetching,
  } = usePersonaQuery(personaId, {
    enabled: false,
    retry: false,
  });

  const handleSubmitPersona = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (!personaId || personaId.length !== 8) {
      toast({
        title: 'Invalid persona ID',
        description: 'Please enter a valid persona ID',
        variant: 'error',
      });
      return;
    }
    if (persona?.persona_id) {
      setSearchResult(persona);
      return;
    }
    const result = await refetch();
    if (result?.data?.persona_id) {
      setSearchResult(result?.data);
    } else {
      toast({
        title: 'Invalid person ID',
        description: 'Please enter a valid persona ID',
        variant: 'error',
      });
    }
  };

  return (
    <form className="mb-4" onSubmit={handleSubmitPersona}>
      <div className="flex w-full items-center gap-2">
        <div className="flex w-full items-center gap-1 rounded-md border bg-background p-2.5">
          <code className="inline-flex gap-1 text-sm text-muted-foreground">
            <span className="font-medium">GET</span>
            <span className="">|</span>
            <span className="">/</span>
            <span className="text-foreground">v2</span>
            <span className="">/</span>
            <span className="text-foreground">personas</span>
            <span className="">/</span>
          </code>
          <input
            value={personaId}
            onChange={handleInputChange}
            maxLength={10}
            type="text"
            placeholder="{enter persona ID here}"
            className="h-5 w-full rounded-md border border-none bg-background p-0 text-muted-foreground focus:outline-none focus:ring-0"
          />
        </div>
        <Button
          disabled={isFetching}
          type="submit"
          className="relative px-6"
          variant="outline"
        >
          GET
          {isFetching && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <Loader className="size-4 animate-spin" />
            </div>
          )}
        </Button>
      </div>
    </form>
  );
};
