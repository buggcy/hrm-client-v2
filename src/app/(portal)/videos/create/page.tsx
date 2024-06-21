'use client';

import React from 'react';

import { useMutation } from '@tanstack/react-query';
import { AxiosProgressEvent } from 'axios';
import { ArrowRight, FileText, Headphones } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { ApiCode, HttpMethods } from '@/components/Code';
import { CopyApiUrl, URLS } from '@/components/CopyApiUrl';
import { Layout, LayoutHeader, LayoutWrapper } from '@/components/Layout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

import { ReplicaSelect } from '@/app/(portal)/videos/create/components/ReplicaSelect';
import {
  IVideoGenerateFormStore,
  useVideoGenerateFormStore,
  useVideoGenerateFormUndoHistory,
} from '@/app/(portal)/videos/create/hooks/useVideoGenerateStore.hook';
import { RQH_API_BASE_URL } from '@/constants';
import {
  CreateVideoDto,
  CreateVideoSchema,
  useCreateVideoMutation,
  useReplicaQuery,
} from '@/hooks';
import { useProgress } from '@/hooks/useProgress.hook';
import { portalApi, schemaParse } from '@/utils';

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
      <TabsList className="mb-4 inline-flex h-9 w-full justify-start space-x-4 rounded-none border-b bg-transparent p-0 text-muted-foreground">
        <TabsTrigger
          className={tabsTriggerClassName}
          asChild
          value={VideoGenerationType.SCRIPT}
        >
          <Button className="flex space-x-1 px-0">
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
  const [name, callbackUrl, set] = useVideoGenerateFormStore(store => [
    store.name,
    store.callbackUrl,
    store.set,
  ]);
  const [isAdvancedSettingsAccordionOpen, setMetadata] =
    useVideoGenerateMetadataStore(store => [
      store.isAdvancedSettingsAccordionOpen,
      store.set,
    ]);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    set({ [event.target.name]: event.target.value });
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    set({
      [event.target.name]: event.target.value?.trim() || '',
    });
  };
  const handleAccordionValueChange = (value: string) => {
    setMetadata({ isAdvancedSettingsAccordionOpen: value === 'true' });
  };

  return (
    <Accordion
      type="single"
      collapsible
      value={isAdvancedSettingsAccordionOpen ? 'true' : ''}
      onValueChange={handleAccordionValueChange}
    >
      <AccordionItem value="true" className="rounded border">
        <AccordionTrigger className="p-4 hover:text-primary hover:no-underline">
          Advanced settings
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 p-4 pt-0">
          <div>
            <Label className="mb-2 inline-block" htmlFor="name">
              Video Name
            </Label>
            <Input
              name="name"
              value={name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={'Test Video'}
            />
          </div>
          <div>
            <Label className="mb-2 inline-block" htmlFor="callbackUrl">
              Callback URL
            </Label>
            <Input
              name="callbackUrl"
              value={callbackUrl}
              type="url"
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="https://webhook.com/callback/12345"
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const getCreateVideoRequestBody = (
  formState: IVideoGenerateFormStore,
): CreateVideoDto => {
  const result: Partial<CreateVideoDto> = {
    replica_id: formState.replicaId,
  };

  if (formState.type === VideoGenerationType.AUDIO)
    result.audio_url = formState.audioUrl || 'audio_url_link';
  else if (formState.type === VideoGenerationType.SCRIPT)
    result.script = formState.script;

  if (formState.name) result.video_name = formState.name;
  if (formState.callbackUrl) result.callback_url = formState.callbackUrl;
  if (formState.backgroundUrl) result.background_url = formState.backgroundUrl;
  if (formState.backgroundSourceUrl)
    result.background_source_url = formState.backgroundSourceUrl;

  return result as CreateVideoDto;
};

const Code = () => {
  const store = useVideoGenerateFormStore();
  const body = getCreateVideoRequestBody(store);

  return (
    <ApiCode
      className=""
      url={`${RQH_API_BASE_URL}${URLS.video}`}
      method={HttpMethods.POST}
      body={body}
    />
  );
};

const Preview = () => {
  const replicaId = useVideoGenerateFormStore(state => state.replicaId);
  const { data } = useReplicaQuery(replicaId);

  return (
    <div className="pointer-events-none relative size-full overflow-hidden rounded">
      {/*TODO: remove on video loaded*/}
      <div className="animate-fadeIn absolute -top-6 mb-10 flex size-full items-center justify-center">
        Loading...
      </div>
      <video
        className="absolute size-full rounded object-cover"
        preload="auto"
        src={data?.thumbnail_video_url as string}
      />
    </div>
  );
};

export default function VideoCreatePage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { undo, redo } = useVideoGenerateFormUndoHistory(state => state);
  const { onUploadProgress, progress, reset } = useProgress();
  const { mutateAsync: uploadAudio, isPending: isUploadingAudio } =
    useUploadAudioMutation();
  const { mutateAsync: createVideo, isPending: isSumbiting } =
    useCreateVideoMutation();
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

    const data = getCreateVideoRequestBody(formState);

    try {
      schemaParse(CreateVideoSchema)(data);

      try {
        if (formState.type === VideoGenerationType.AUDIO) {
          if (!formState.audioUrl && metadataState.audio?.file) {
            const url = await uploadAudio({
              file: metadataState.audio.file,
              onUploadProgress,
            });
            reset();
            formState.set({ audioUrl: url });
            data.audio_url = url;
          }
        }

        // TODO: throw 18n error
        await createVideo(data);
      } catch (error) {
        toast({
          title: t('portal.videos.create.error'),
          description: (error as Error).message,
        });
      }
    } catch (_error) {
      const { issues } = _error as z.ZodError<CreateVideoSchema>;
      const message = issues.map(issue => issue.message).join(',');
      const paths = issues.flatMap(issue => issue.path[0]);

      toast({
        title: 'Error',
        description: message,
      });

      if (paths.some(path => path === 'callback_url'))
        //   // TODO: focus on input
        metadataState.set({
          isAdvancedSettingsAccordionOpen: true,
        });
    }

    console.log('SUBMIT', { formState, metadataState });
  };

  return (
    <Layout className="flex max-h-screen flex-col">
      <LayoutHeader title="Video Generation">
        <CopyApiUrl type="POST" url="video" />
      </LayoutHeader>
      <LayoutWrapper
        onKeyDown={handleKeyDown}
        wrapperClassName="flex flex-1 h-[calc(100vh-62px)] "
        className="grid grid-cols-2 grid-rows-2 gap-6"
      >
        <form
          onSubmit={handleSubmit}
          className="col-span-1 row-span-2 flex flex-col gap-6 rounded-md border border-border bg-background p-4"
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
            {isSumbiting && 'Submitting...'}
            <Button type="submit">
              Generate <ArrowRight size={16} className="ml-1" />
            </Button>
          </footer>
        </form>
        <div className="col-span-1 row-span-1 flex w-full rounded-md border border-border bg-background p-4">
          <Tabs
            defaultValue="preview"
            className="flex w-full flex-col overflow-hidden rounded"
          >
            <div className="mb-4 flex justify-between">
              <Badge variant="label" className="w-fit text-sm">
                Preview
              </Badge>

              <TabsList>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="preview"
              asChild
              className="mt-0 flex size-full overflow-hidden"
            >
              <Preview />
            </TabsContent>
            <TabsContent
              value="code"
              asChild
              className="mt-0 flex h-full flex-col overflow-hidden"
            >
              <Code />
            </TabsContent>
          </Tabs>
        </div>
        {/*<div className="col-span-1 row-span-1 rounded-md border border-border bg-background p-4">*/}
        {/*  /!*videos*!/*/}
        {/*</div>*/}
      </LayoutWrapper>
    </Layout>
  );
}
