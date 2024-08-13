import React from 'react';

import { useQuery } from '@tanstack/react-query';
import { WandSparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SimpleTooltip } from '@/components/ui/tooltip';

import { useCreateVideoFormStore } from '@/app/(portal)/videos/create/hooks';

const useRandomScriptsQuery = () =>
  useQuery({
    queryKey: ['random-script'],
    queryFn: (): Promise<string[]> =>
      import('~/files/scripts.json').then(module => module.default),
    staleTime: Infinity,
  });

export const ScriptInput = () => {
  const { t } = useTranslation();
  const { data: randomScripts } = useRandomScriptsQuery();
  const [script, set] = useCreateVideoFormStore(
    useShallow(store => [store.script, store.set]),
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    set({ script: e.target.value });
  };

  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    set({
      script: event.target.value?.trim() || '',
    });
  };

  const handleRandomScript = () => {
    set({
      script: randomScripts![Math.floor(Math.random() * randomScripts!.length)],
    });
  };

  return (
    <div className="mt-4 flex h-full gap-2">
      <Textarea
        value={script}
        onChange={handleChange}
        required
        onBlur={handleBlur}
        placeholder={t('portal.videos.create.script.placeholder')}
        className="h-full resize-none border-none p-0.5 focus-visible:ring-transparent"
      />
      <SimpleTooltip tooltipContent="Random script">
        <Button
          type="button"
          variant="ghostSecondary"
          className="mr-1 size-10 min-w-10 rounded-full p-1"
          onClick={handleRandomScript}
          disabled={!randomScripts}
        >
          <span className="sr-only">Random script</span>
          <WandSparkles size={16} />
        </Button>
      </SimpleTooltip>
    </div>
  );
};
