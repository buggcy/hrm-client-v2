import React from 'react';

import { useQuery } from '@tanstack/react-query';
import { WandSparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import { useVideoGenerateFormStore } from '@/app/(portal)/videos/create/hooks';

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
  const [script, set] = useVideoGenerateFormStore(store => [
    store.script,
    store.set,
  ]);

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
    <div className="flex h-full gap-2">
      <Textarea
        value={script}
        onChange={handleChange}
        required
        onBlur={handleBlur}
        placeholder={t('portal.videos.create.script.placeholder')}
        className="h-full resize-none border-none p-0"
      />
      <div>
        <span className="sr-only">Random script</span>
        <Button
          type="button"
          variant="ghostSecondary"
          className="size-10 min-w-10 rounded-full p-1"
          onClick={handleRandomScript}
          disabled={!randomScripts}
        >
          <WandSparkles size={16} />
        </Button>
      </div>
    </div>
  );
};
