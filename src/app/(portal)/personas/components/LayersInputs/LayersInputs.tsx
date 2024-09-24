import { ChevronDown } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { cn } from '@/utils';

import { LabelWithPopover } from '../LabelWithPopover';
import { LLM_ENGINE, TTS_ENGINE, useCreatePersonaFormStore } from '../../hooks';

export const LayersInputs = () => {
  const [
    ttsEngine,
    ttsVoiceId,
    ttsApiKey,
    llmName,
    customLLM,
    llmApiKey,
    llmApiUrl,
    set,
  ] = useCreatePersonaFormStore(
    useShallow(state => [
      state.ttsEngine,
      state.ttsVoiceId,
      state.ttsApiKey,
      state.llmName,
      state.customLLM,
      state.llmApiKey,
      state.llmApiUrl,
      state.set,
    ]),
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    set({ [name]: value });
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    set({ [name]: value.trim() });
  };

  return (
    <Accordion type="multiple" className="mt-2" defaultValue={['llm', 'tts']}>
      <AccordionItem value="llm" className="mb-6 h-full rounded border">
        <AccordionTrigger
          hideIcon
          className="items-start p-4 text-sm hover:no-underline [&[data-state=open]>div>div>svg]:rotate-180"
        >
          <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-2">
              <ChevronDown className="size-4 shrink-0 transition-transform duration-200" />
              <span>Language Model (LLM)</span>
            </div>
            <span className="text-start text-muted-foreground">
              Choose the LLM model and configure integration parameters.
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex h-full flex-col p-4 pt-0">
          <LabelWithPopover
            popoverContent={
              <p>
                The model name that will be used by the llm. To use Tavus&apos;
                llms, you may select from the following models:{' '}
                <code>tavus-llama</code>, <code>tavus-gpt-4o</code>,{' '}
                <code>tavus-gpt-4o-mini</code>. If you would like to use your
                own OpenAI compatible llm, you may provide a model, base_url,
                and api_key.
              </p>
            }
          >
            Model Name
          </LabelWithPopover>
          <Select
            value={llmName}
            onValueChange={value => set({ llmName: value as LLM_ENGINE })}
          >
            <SelectTrigger
              className={cn('mb-4', {
                'mb-2': llmName === LLM_ENGINE.CUSTOM,
              })}
            >
              <SelectValue placeholder="Model name" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={LLM_ENGINE.TAVUS_LLAMA}>
                tavus-llama{' '}
                <span className="text-muted-foreground">(default)</span>
              </SelectItem>
              <SelectItem value={LLM_ENGINE.TAVUS_GPT_4O}>
                tavus-gpt-4o
              </SelectItem>
              <SelectItem value={LLM_ENGINE.TAVUS_GPT_4O_MINI}>
                tavus-gpt-4o-mini
              </SelectItem>
              <SelectItem value={LLM_ENGINE.CUSTOM}>Custom</SelectItem>
            </SelectContent>
          </Select>
          {llmName === LLM_ENGINE.CUSTOM && (
            <Input
              className="mb-4"
              type="text"
              placeholder="Enter model name"
              name="customLLM"
              value={customLLM}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          )}

          <LabelWithPopover
            popoverContent={
              <p>The base url for your OpenAI compatible endpoint.</p>
            }
          >
            Base URL
          </LabelWithPopover>
          <Input
            className="mb-4"
            type="text"
            placeholder="Enter base URL"
            name="llmApiUrl"
            value={llmApiUrl}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={llmName !== LLM_ENGINE.CUSTOM}
          />
          <LabelWithPopover
            popoverContent={
              <p>The API key for the OpenAI compatible endpoint.</p>
            }
          >
            API Key
          </LabelWithPopover>
          <Input
            type="text"
            placeholder="Enter API key"
            name="llmApiKey"
            value={llmApiKey}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={llmName !== LLM_ENGINE.CUSTOM}
          />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="tts" className="h-full rounded border">
        <AccordionTrigger
          hideIcon
          className="items-start p-4 text-sm hover:text-primary hover:no-underline [&[data-state=open]>div>div>svg]:rotate-180"
        >
          <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-2">
              <ChevronDown className="size-4 shrink-0 transition-transform duration-200" />
              <span>Text-to-Speech (TTS)</span>
            </div>
            <span className="text-start text-muted-foreground">
              Configure the settings for the selected text-to-speech engine.
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex h-full flex-col p-4 pt-0">
          <LabelWithPopover
            popoverContent={<p>The TTS engine that will be used.</p>}
          >
            TTS Engine
          </LabelWithPopover>
          <Select
            value={ttsEngine}
            onValueChange={value => set({ ttsEngine: value as TTS_ENGINE })}
          >
            <SelectTrigger className="mb-4">
              <SelectValue placeholder="TTS Engine" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TTS_ENGINE.DEFAULT}>Tavus Default</SelectItem>
              <SelectItem value={TTS_ENGINE.CARTESIA}>Cartesia</SelectItem>
              <SelectItem value={TTS_ENGINE.ELEVENLABS}>Elevenlabs</SelectItem>
              <SelectItem value={TTS_ENGINE.PLAYHT}>Playht</SelectItem>
            </SelectContent>
          </Select>
          <LabelWithPopover
            popoverContent={<p>The voice ID to be used for the TTS engine.</p>}
          >
            External Voice ID
          </LabelWithPopover>
          <Input
            className="mb-4"
            type="text"
            placeholder="Enter voice ID"
            name="ttsVoiceId"
            value={ttsVoiceId}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={ttsEngine === TTS_ENGINE.DEFAULT}
          />
          <LabelWithPopover
            popoverContent={
              <p>
                The custodial API key to be used to make requests to the chosen
                TTS provider.
              </p>
            }
          >
            API Key
          </LabelWithPopover>
          <Input
            type="text"
            placeholder="Enter API key"
            name="ttsApiKey"
            value={ttsApiKey}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={ttsEngine === TTS_ENGINE.DEFAULT}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
