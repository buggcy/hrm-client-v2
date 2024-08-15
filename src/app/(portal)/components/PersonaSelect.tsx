'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { format } from 'date-fns';
import { Check, ChevronDown, Copy } from 'lucide-react';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

import { useCopyToClipboard, useReplicaQuery } from '@/hooks';
import {
  DEFAULT_PERSONA,
  usePersonaQuery,
  usePersonasQuery,
} from '@/hooks/usePersonas';
import { cn, createReplicaThumbnailUrl } from '@/utils';

import { IPersona, PersonaType } from '@/types';

export const PersonaCard = ({
  persona,
  isSelected,
  onClick,
}: {
  isDefault?: boolean;
  persona: IPersona;
  isSelected: boolean;
  onClick: (id?: IPersona['persona_id']) => void;
}) => {
  const { data: replica } = useReplicaQuery(
    persona.default_replica_id as string,
    {
      enabled: !!persona.default_replica_id,
    },
  );

  return (
    <div
      className={cn('flex cursor-pointer space-x-4 rounded-lg border p-4', {
        'border-primary': isSelected,
      })}
      onClick={() => onClick(persona.persona_id)}
    >
      <Avatar className="size-8">
        <video
          className="aspect-video size-full rounded-md bg-black object-cover"
          muted
          crossOrigin="anonymous"
        >
          <source
            src={createReplicaThumbnailUrl(replica?.thumbnail_video_url)}
            type="video/mp4"
          />
        </video>
      </Avatar>
      <div className="w-full overflow-hidden">
        <h3 className="truncate font-semibold">{persona.persona_name}</h3>
        <p className="mt-1 w-full truncate text-sm text-muted-foreground">
          {persona.system_prompt}
        </p>
      </div>
    </div>
  );
};

const Item = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center gap-4">
    <div className="w-full max-w-38.5">
      <p className="text-sm font-semibold">{label}</p>
    </div>
    <div className="w-full">
      <p className="text-sm font-medium">{children}</p>
    </div>
  </div>
);

const SelectPersonaDialog = ({
  value,
  onChange,
  children,
}: {
  value?: IPersona['persona_id'];
  onChange: (value?: IPersona['persona_id']) => void;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [selectedPersonaId, setSelectedPersonaId] = useState(value);
  const { data } = usePersonaQuery(selectedPersonaId);

  const selectedPersona = selectedPersonaId ? data : DEFAULT_PERSONA;

  const { data: replica } = useReplicaQuery(
    selectedPersona?.default_replica_id as string,
    {
      enabled: !!selectedPersona?.default_replica_id,
    },
  );

  const { isCopied, copyToClipboard } = useCopyToClipboard({
    textToCopy: selectedPersona?.system_prompt,
  });

  useEffect(() => {
    setSelectedPersonaId(value);
  }, [value]);

  const { data: stockPersonas } = usePersonasQuery({
    queryParams: {
      limit: 10,
      persona_type: PersonaType.STUDIO,
    },
  });
  const { data: personalPersonas } = usePersonasQuery({
    queryParams: {
      limit: 10,
      persona_type: PersonaType.PERSONAL,
    },
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleSubmit = () => {
    setOpen(false);
    onChange(selectedPersonaId);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={handleOpen}>
        {children}
      </DialogTrigger>
      <DialogContent className="h-[80vh] w-[95%] max-w-screen-lg overflow-hidden p-0">
        <div className="relative flex h-[inherit] max-h-full max-w-[inherit] flex-col justify-between">
          <div className="relative inset-0 flex size-[inherit] flex-1 pb-11">
            <div className="flex w-full flex-1 flex-col p-6 md:w-1/2">
              <h2 className="mb-4 text-xl font-bold">Pick a Persona</h2>
              <div className="no-scrollbar h-full space-y-4 overflow-y-scroll">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Personal Personas</h3>
                  <Button variant="link" className="text-primary" asChild>
                    <Link href="/personas/create">+ Create Persona</Link>
                  </Button>
                </div>
                <ul className="flex flex-col gap-4">
                  {personalPersonas?.data?.map(persona => (
                    <li key={persona.persona_id}>
                      <PersonaCard
                        persona={persona}
                        isSelected={selectedPersonaId === persona.persona_id}
                        onClick={setSelectedPersonaId}
                      />
                    </li>
                  ))}
                </ul>
                <h3 className="text-lg font-semibold">Stock Personas</h3>
                <ul className="!mb-2 flex flex-col gap-4">
                  <li key="DEFAULT">
                    <PersonaCard
                      persona={DEFAULT_PERSONA}
                      isSelected={!selectedPersonaId}
                      onClick={setSelectedPersonaId}
                    />
                  </li>
                  {stockPersonas?.data?.map(persona => (
                    <li key={persona.persona_id}>
                      <PersonaCard
                        persona={persona}
                        isSelected={selectedPersonaId === persona.persona_id}
                        onClick={setSelectedPersonaId}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/*TODO: Add loading state*/}
            <div className="no-scrollbar hidden flex-1 flex-col overflow-x-hidden overflow-y-scroll border-l p-6 pr-12 md:flex md:w-1/2">
              {replica?.thumbnail_video_url && (
                <video
                  className="mb-4 aspect-video w-full rounded-md bg-black"
                  muted
                  preload="metadata"
                  controls={false}
                  key={replica.thumbnail_video_url}
                >
                  <source
                    src={createReplicaThumbnailUrl(
                      replica?.thumbnail_video_url,
                    )}
                    type="video/mp4"
                  />
                </video>
              )}
              <h3 className="w-full truncate text-lg font-semibold">
                {selectedPersona?.persona_name}
              </h3>
              <div className="my-4 space-y-3">
                <Item label="Persona ID">{selectedPersona?.persona_id}</Item>
                <Item label="Replica ID">
                  {selectedPersona?.default_replica_id}
                </Item>
                {selectedPersona?.created_at && (
                  <Item label="Created">
                    {selectedPersona?.created_at &&
                      format(selectedPersona.created_at, 'MMMM d, h:mm aaa')}
                  </Item>
                )}
              </div>
              {selectedPersona?.system_prompt && (
                <div className="mb-2 h-[15.375rem] rounded-md border bg-secondary">
                  <div className="flex items-center justify-between px-4 pb-2 pt-4">
                    <p className="text-sm font-semibold text-muted-foreground">
                      System Prompt
                    </p>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8"
                      onClick={copyToClipboard}
                    >
                      {isCopied ? (
                        <Check className="size-4" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </Button>
                  </div>
                  <textarea
                    className="h-48 w-full resize-none rounded-md bg-secondary px-4 pb-4 text-sm font-normal text-muted-foreground outline-none"
                    value={selectedPersona.system_prompt}
                    readOnly
                  ></textarea>
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="sticky bottom-0 border-t bg-background p-3">
            <Button onClick={handleSubmit}>Select</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const PersonaSelect = ({
  value,
  onChange,
}: {
  value?: IPersona['persona_id'];
  onChange: (value?: IPersona['persona_id']) => void;
}) => {
  const { data: selectedPersona, isLoading } = usePersonaQuery(value);

  return (
    <div className="flex w-full flex-col">
      <Label className="mb-2 inline-block">Persona</Label>
      <SelectPersonaDialog value={value} onChange={onChange}>
        <Button
          variant="ghost"
          type="button"
          className="group h-auto min-h-10 w-full items-center rounded-md border border-border bg-background px-3 py-2 hover:border-primary hover:bg-background"
        >
          <p className="mr-1 text-sm">
            {selectedPersona?.persona_name ||
              (isLoading ? 'Loading Persona...' : 'Default Persona')}
          </p>
          <ChevronDown
            className="ml-auto text-muted-foreground group-hover:text-primary"
            size={16}
          />
        </Button>
      </SelectPersonaDialog>
    </div>
  );
};
