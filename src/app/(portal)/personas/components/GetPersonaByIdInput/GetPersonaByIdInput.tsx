'use client';

import { Loader } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { IPersona } from '@/types';

export const GetPersonaByIdInput = ({
  personaId,
  setPersonaId,
  handleSubmitPersona,
  isFetching,
  setSearchResult,
}: {
  personaId?: IPersona['persona_id'];
  setPersonaId: (id: IPersona['persona_id']) => void;
  isFetching?: boolean;
  handleSubmitPersona: (event: React.FormEvent<HTMLFormElement>) => void;
  setSearchResult: (persona: IPersona | null) => void;
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 8) return;
    if (event.target.value.length === 0) {
      setSearchResult(null);
    }

    setPersonaId(event.target.value);
  };

  return (
    <form className="mb-4" onSubmit={handleSubmitPersona}>
      <div className="flex w-full items-center gap-2">
        <div className="flex w-full items-center gap-1 rounded-md border bg-white p-2.5">
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
            className="h-5 w-full rounded-md border border-none bg-white p-0 text-muted-foreground focus:outline-none focus:ring-0"
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
