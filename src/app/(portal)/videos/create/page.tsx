'use client';

import React from 'react';

import { useMutation } from '@tanstack/react-query';
import { AxiosProgressEvent } from 'axios';
import { ArrowRight, FileText, Headphones } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { CopyApiUrl } from '@/components/CopyApiUrl';
import { Layout, LayoutHeader, LayoutWrapper } from '@/components/Layout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTriggerLeftArrow,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

import { ReplicaSelect } from '@/app/(portal)/videos/create/components/ReplicaSelect';
import {
  useVideoGenerateFormStore,
  useVideoGenerateFormUndoHistory,
} from '@/app/(portal)/videos/create/hooks/useVideoGenerateStore.hook';
import { useProgress } from '@/hooks/useProgress.hook';
import { portalApi } from '@/utils';

import { AudioInput } from './components/AudioInput';
import { ScriptInput } from './components/ScriptInput';
import { useVideoGenerateMetadataStore } from './hooks';
import { VideoGenerationType } from './types';

const tabsTriggerClassName =
  'inline-flex items-center  justify-center whitespace-nowrap py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50  relative h-9 rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none  data-[state=active]:border-b-black data-[state=active]:focus:border-b-primary data-[state=active]:hover:border-b-primary focus:!text-primary hover:!text-primary data-[state=active]:text-foreground data-[state=active]:border-foreground data-[state=active]:shadow-none';

const ScriptAndAudioInputsTab = () => {
  const { t } = useTranslation();
  const { type, set } = useVideoGenerateFormStore();

  const handleTypeChange = (value: string) => {
    set({ type: value as VideoGenerationType });
  };

  return (
    <Tabs
      value={type}
      onValueChange={handleTypeChange}
      className="flex flex-1 flex-col"
    >
      <TabsList className="mb-4 inline-flex  h-9 w-full justify-start space-x-4  rounded-none border-b bg-transparent p-0 text-muted-foreground ">
        <TabsTrigger
          className={tabsTriggerClassName}
          asChild
          value={VideoGenerationType.SCRIPT}
        >
          <Button className=" flex space-x-1 px-0">
            <FileText size={16} />
            <span>{t('portal.videos.create.tabs.script')}</span>
          </Button>
        </TabsTrigger>
        <TabsTrigger
          className={tabsTriggerClassName}
          asChild
          value={VideoGenerationType.AUDIO}
        >
          <Button className="flex items-center space-x-1 px-0">
            <Headphones size={16} />
            <span>{t('portal.videos.create.tabs.audio')}</span>
          </Button>
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value={VideoGenerationType.SCRIPT}
        className="h-full"
        asChild
      >
        <ScriptInput />
      </TabsContent>
      <TabsContent value={VideoGenerationType.AUDIO} className="h-full" asChild>
        <AudioInput />
      </TabsContent>
    </Tabs>
  );
};

// const formSchema = z.object({
//   replicaId: z.string(),
//   name: z.string().trim().min(1).optional(),
// });

// export const scriptFormSchema = formSchema.extend({
//   script: z.string().trim().min(1),
// });
//
// export const audioFormSchema = formSchema.extend({
//   audioUrl: z.string(),
// });

type onUploadProgress = (progress: AxiosProgressEvent) => void;

const uploadAudio = ({
  file,
  onUploadProgress,
}: {
  file: File;
  onUploadProgress?: onUploadProgress;
}) => {
  const formData = new FormData();

  formData.append('audio', file);

  return portalApi.post<unknown, string>(`/upload/audio`, formData, {
    onUploadProgress,
  });
};

const useUploadAudioMutation = () =>
  useMutation({
    mutationKey: ['audio'],
    mutationFn: uploadAudio,
  });

const KeyPressService = {
  isUndo: (event: React.KeyboardEvent) =>
    (event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey,
  isRedo: (event: React.KeyboardEvent) =>
    (event.ctrlKey || event.metaKey) && event.key === 'z' && event.shiftKey,
};

// const CustomAccordion = ({ open = true, onChange, children }) => {
//   return (
//     <div className="rounded border border-border">
//       <Button>{open ? 'Close' : 'Open'}</Button>
//       {open && children}
//     </div>
//   );
// };
const AdvancedInputs = () => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="true" className="rounded border">
        <AccordionTriggerLeftArrow>Advanced settings</AccordionTriggerLeftArrow>
        <AccordionContent className="p-4 pt-0">
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default function VideoCreatePage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { undo, redo } = useVideoGenerateFormUndoHistory(state => state);
  const { onUploadProgress, progress, reset } = useProgress();
  const { mutateAsync: uploadAudio, isPending: isUploadingAudio } =
    useUploadAudioMutation();

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (KeyPressService.isUndo(event)) {
      event.preventDefault();
      undo();
    } else if (KeyPressService.isRedo(event)) {
      event.preventDefault();
      redo();
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formState = useVideoGenerateFormStore.getState();
    const metadataState = useVideoGenerateMetadataStore.getState();

    console.log('SUBMIT', { formState, metadataState });

    try {
      if (formState.type === VideoGenerationType.AUDIO) {
        if (!formState.audioUrl) {
          if (metadataState.audio?.file)
            await uploadAudio({
              file: metadataState.audio.file,
              onUploadProgress,
            }).then(reset);
          // NEVER REACH: audio input is required
          else throw new Error('Audio is required');
        }
      }
    } catch (error) {
      toast({
        title: t('portal.videos.create.error'),
        description: (error as Error).message,
      });
    }
  };

  return (
    <Layout className="flex flex-col">
      <LayoutHeader title="Video Generation">
        <CopyApiUrl type="POST" url="video" />
      </LayoutHeader>
      <LayoutWrapper
        onKeyDown={handleKeyDown}
        wrapperClassName="flex flex-1 h-auto"
        className="flex h-auto flex-1 gap-6"
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col gap-6 rounded-md border border-border bg-background p-4"
        >
          <Badge variant="label" className="w-fit text-sm">
            Input
          </Badge>
          <ReplicaSelect />
          <ScriptAndAudioInputsTab />
          <AdvancedInputs />
          <footer className="flex flex-col items-end">
            <Separator className="mb-4" />
            {isUploadingAudio && `Uploading audio ${progress}%`}
            <Button type="submit">
              Generate <ArrowRight size={16} className="ml-1" />
            </Button>
          </footer>
        </form>
        <div className="flex flex-1  rounded-md border border-border bg-background p-4"></div>
      </LayoutWrapper>
    </Layout>
  );
}
