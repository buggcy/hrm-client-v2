'use client';

import React, { useEffect, useMemo, useState } from 'react';

import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

import {
  DEFAULT_PERSONA,
  usePersonaQuery,
  usePersonasInfinityQuery,
} from '@/hooks/usePersonas';

import { PersonaDetails } from './components/PersonaDetails';
import { PersonasBlock } from './components/PersonasBlock';

import { IPersona, PersonaType } from '@/types';

const LIMIT = 10;

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

  useEffect(() => {
    setSelectedPersonaId(value);
  }, [value]);

  const {
    data: stockPersonas,
    // isLoading: stockPersonasIsLoading,
    // isRefetching: stockPersonasIsRefetching,
    // isPlaceholderData: stockPersonasIsPlaceholderData,
    fetchNextPage: fetchNextPageStock,
    hasNextPage: hasNextPageStock,
    isFetchingNextPage: isFetchingNextPageStock,
  } = usePersonasInfinityQuery({
    refetchInterval: false,
    refetchOnWindowFocus: false,
    queryParams: {
      limit: LIMIT,
      persona_type: PersonaType.STUDIO,
    },
  });

  const {
    data: personalPersonas,
    // isLoading: personalPersonasIsLoading,
    // isRefetching,
    // isPlaceholderData,
    fetchNextPage: fetchNextPagePersonal,
    hasNextPage: hasNextPagePersonal,
    isFetchingNextPage: isFetchingNextPagePersonal,
  } = usePersonasInfinityQuery({
    refetchInterval() {
      return 5 * 60 * 1000;
    },
    refetchOnWindowFocus: false,
    queryParams: {
      limit: LIMIT,
      persona_type: PersonaType.PERSONAL,
    },
  });

  const stockPersonasData = useMemo(() => {
    return stockPersonas?.pages?.map(page => page.data).flat();
  }, [stockPersonas]);

  const personalPersonasData = useMemo(() => {
    return personalPersonas?.pages?.map(page => page.data).flat();
  }, [personalPersonas]);

  const totalStockPersonas = stockPersonas?.pages?.[0]?.total_count || 0;
  const totalPersonalPersonas = personalPersonas?.pages?.[0]?.total_count || 0;

  const handleLoadMoreStock = () => {
    void fetchNextPageStock();
  };

  const handleLoadMorePersonal = () => {
    void fetchNextPagePersonal();
  };

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
                <PersonasBlock
                  label="Personal Personas"
                  personas={personalPersonasData}
                  selectedPersonaId={selectedPersonaId}
                  setSelectedPersonaId={setSelectedPersonaId}
                  withCreateButton
                  onLoadMore={
                    hasNextPagePersonal ? handleLoadMorePersonal : undefined
                  }
                  isFetchingNextPage={isFetchingNextPagePersonal}
                  total={totalPersonalPersonas}
                />
                <PersonasBlock
                  label="Stock Personas"
                  personas={stockPersonasData}
                  selectedPersonaId={selectedPersonaId}
                  setSelectedPersonaId={setSelectedPersonaId}
                  onLoadMore={
                    hasNextPageStock ? handleLoadMoreStock : undefined
                  }
                  isFetchingNextPage={isFetchingNextPageStock}
                  total={totalStockPersonas}
                />
              </div>
            </div>
            {/*TODO: Add loading state*/}
            <PersonaDetails selectedPersona={selectedPersona} />
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
