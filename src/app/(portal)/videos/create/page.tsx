'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';

import { Query, useMutation } from '@tanstack/react-query';
import { AxiosProgressEvent } from 'axios';
import {
  ArrowRight,
  ChevronRight,
  FileText,
  Headphones,
  Loader,
  Trash2,
  TriangleAlert,
  Video,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useShallow } from 'zustand/react/shallow';

import { ApiCode, HttpMethods } from '@/components/Code';
import { CopyApiUrl, URLS } from '@/components/CopyApiUrl';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

import {
  useVideoDetailsSheet,
  VideoDetailsSheet,
} from '@/app/(portal)/videos/components/VideoDetailsSheet';
import { ReplicaSelect } from '@/app/(portal)/videos/create/components/ReplicaSelect';
import { UploadBackgroundTab } from '@/app/(portal)/videos/create/components/UploadBackground';
import {
  IVideoGenerateFilesStore,
  IVideoGenerateFormStore,
  useVideoGenerateFormStore,
  useVideoGenerateFormUndoHistory,
} from '@/app/(portal)/videos/create/hooks/useVideoGenerateStore.hook';
import { RQH_API_BASE_URL } from '@/constants';
import {
  CreateVideoDto,
  CreateVideoSchema,
  IVideosResponse,
  useCreateVideoMutation,
  useReplicaQuery,
  useVideosQuery,
} from '@/hooks';
import { queryClient } from '@/libs';
import { cn, portalApi, schemaParse } from '@/utils';

import { AudioInput } from './components/AudioInput';
import { ScriptInput } from './components/ScriptInput';
import { useVideoGenerateFilesStore } from './hooks';
import { VideoBackgroundType, VideoGenerationType } from './types';

import { IVideo, VideoStatus } from '@/types';

const tabsTriggerClassName =
  'inline-flex items-center  justify-center whitespace-nowrap py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50  relative h-9 rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none  data-[state=active]:border-b-black data-[state=active]:focus:border-b-primary data-[state=active]:hover:border-b-primary focus:!text-primary hover:!text-primary data-[state=active]:text-foreground data-[state=active]:border-foreground data-[state=active]:shadow-none';

const ScriptAndAudioInputsTab = () => {
  const { t } = useTranslation();
  const [type, set] = useVideoGenerateFormStore(
    useShallow(store => [store.type, store.set]),
  );

  const handleTypeChange = (value: string) => {
    set({ type: value as VideoGenerationType });
  };

  return (
    <Tabs
      value={type}
      onValueChange={handleTypeChange}
      className="flex flex-1 flex-col"
    >
      <TabsList className="no-scrollbar inline-flex max-h-9 min-h-9 w-full justify-start space-x-4 overflow-y-hidden overflow-x-scroll rounded-none border-b bg-transparent p-0 text-muted-foreground">
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

  const extStartsFromIndex = file.name.lastIndexOf('.');
  const [fileName, extension] = [
    file.name.slice(0, extStartsFromIndex),
    file.name.slice(extStartsFromIndex + 1),
  ];
  const newName = `${fileName}-${new Date().toISOString()}.${extension}`;
  const _file = new File([file], newName, { type: file.type });

  formData.append('file', _file);

  return portalApi.post<unknown, string>(
    `/v1/uploads/file/developer-portal-audio`,
    formData,
    {
      onUploadProgress,
    },
  );
};

const useUploadBackground = ({ file }: { file: File }) => {
  const formData = new FormData();

  formData.append('file', file);

  return portalApi.post<unknown, string>(
    `/v1/uploads/file/developer-portal-audio`,
    // `/v1/uploads/file/developer-portal-background`,
    formData,
  );
};

const useUploadAudioMutation = () =>
  useMutation({
    mutationKey: ['uploadAudio'],
    mutationFn: uploadAudio,
  });

const KeyPressService = {
  isUndo: (event: React.KeyboardEvent) =>
    (event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey,
  isRedo: (event: React.KeyboardEvent) =>
    (event.ctrlKey || event.metaKey) && event.key === 'z' && event.shiftKey,
};

const WebsiteUrlTab = () => {
  const [backgroundUrl, set] = useVideoGenerateFormStore(
    useShallow(store => [store.backgroundUrl, store.set]),
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    set({ backgroundUrl: event.target.value });
  };
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    set({
      backgroundUrl: event.target.value?.trim() || '',
    });
  };

  return (
    <div className="mt-4">
      <Label className="mb-2 inline-block" htmlFor="backgroundUrl">
        Website URL
      </Label>
      <Input
        type="url"
        required={!!backgroundUrl}
        value={backgroundUrl}
        onChange={handleChange}
        onBlur={handleBlur}
        name="backgroundUrl"
        placeholder="https://www.tavus.io/"
      />
    </div>
  );
};

const BackgroundInput = () => {
  const [withBackground, backgroundType, set] = useVideoGenerateFormStore(
    useShallow(store => [
      store.withBackground,
      store.backgroundType,
      store.set,
    ]),
  );

  const handleCheckedChange = (checked: boolean) => {
    set({ withBackground: checked });
  };
  const handleChange = (value: string) => {
    set({ backgroundType: value as VideoBackgroundType });
  };

  return (
    <div className="flex flex-col gap-4 rounded border p-4">
      <div className="flex items-center space-x-2">
        <Switch
          checked={withBackground}
          id="background"
          onCheckedChange={handleCheckedChange}
        />
        <Label htmlFor="background" className="cursor-pointer">
          Background
        </Label>
      </div>
      {withBackground && (
        <Tabs
          value={backgroundType}
          onValueChange={handleChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value={VideoBackgroundType.UPLOAD_FILE}>
              Upload File
            </TabsTrigger>
            <TabsTrigger value={VideoBackgroundType.WEBSITE_URL}>
              Website URL
            </TabsTrigger>
          </TabsList>
          <TabsContent value={VideoBackgroundType.UPLOAD_FILE} asChild>
            <UploadBackgroundTab />
          </TabsContent>
          <TabsContent value={VideoBackgroundType.WEBSITE_URL} asChild>
            <WebsiteUrlTab />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
const AdvancedSettingsInputs = () => {
  const [name, callbackUrl, isAdvancedSettingsOpen, set] =
    useVideoGenerateFormStore(
      useShallow(store => [
        store.name,
        store.callbackUrl,
        store.isAdvancedSettingsOpen,
        store.set,
      ]),
    );
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    set({ [event.target.name]: event.target.value });
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    set({
      [event.target.name]: event.target.value?.trim() || '',
    });
  };
  const handleAccordionValueChange = (value: string) => {
    set({ isAdvancedSettingsOpen: value === 'true' });
  };

  return (
    <Accordion
      type="single"
      collapsible
      value={isAdvancedSettingsOpen ? 'true' : ''}
      onValueChange={handleAccordionValueChange}
      className="mt-2"
    >
      <AccordionItem value="true" className="h-full rounded border">
        <AccordionTrigger className="p-4 !ring-primary hover:text-primary hover:no-underline">
          Advanced settings
        </AccordionTrigger>
        <AccordionContent className="flex h-full flex-col gap-4 p-4 pt-0">
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
          <BackgroundInput />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const DEFAULT_BACKGROUND_URL = 'https://www.tavus.io/';
const DEFAULT_BACKGROUND_SOURCE_URL = 'https://storage.com/background.mp4';

const getCreateVideoRequestBody = (
  formState: IVideoGenerateFormStore,
  formFileState: IVideoGenerateFilesStore,
): CreateVideoDto => {
  const result: Partial<CreateVideoDto> = {
    replica_id: formState.replicaId,
  };

  if (formState.type === VideoGenerationType.AUDIO && formState.audioUrl)
    result.audio_url = formState.audioUrl;
  else if (formState.type === VideoGenerationType.SCRIPT)
    result.script = formState.script || '';

  if (formState.name) result.video_name = formState.name;
  if (formState.callbackUrl) result.callback_url = formState.callbackUrl;

  if (formState.withBackground) {
    if (formState.backgroundType === VideoBackgroundType.WEBSITE_URL)
      result.background_url = formState.backgroundUrl || DEFAULT_BACKGROUND_URL;
    else if (
      (formState.backgroundType === VideoBackgroundType.UPLOAD_FILE &&
        formState.backgroundSourceUrl) ||
      !formFileState.background?.file
    )
      result.background_source_url =
        formState.backgroundSourceUrl || DEFAULT_BACKGROUND_SOURCE_URL;
  }
  return result as CreateVideoDto;
};

const Code = () => {
  const formStore = useVideoGenerateFormStore();
  const formFileStore = useVideoGenerateFilesStore();
  const body = useMemo(() => {
    const result = getCreateVideoRequestBody(formStore, formFileStore);

    if (formStore.type === VideoGenerationType.AUDIO) {
      result.audio_url ??= '<audio_url>';
    }
    if (
      formStore.backgroundType === VideoBackgroundType.UPLOAD_FILE &&
      formFileStore.background?.file &&
      !formStore.backgroundSourceUrl
    )
      result.background_source_url = '<background_source_url>';

    return result;
  }, [formStore, formFileStore]);

  return (
    <ApiCode
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
        Loading ...
      </div>
      <video
        className="absolute size-full rounded object-cover"
        preload="auto"
        src={data?.thumbnail_video_url as string}
      />
      {/*  TODO: Add preview label*/}
    </div>
  );
};

const getIcon = (status: VideoStatus) => {
  switch (status) {
    case VideoStatus.GENERATING:
    case VideoStatus.QUEUED:
      return <Loader className="size-6 text-progress" />;
    case VideoStatus.ERROR:
      return <TriangleAlert className="size-6 text-destructive" />;
    case VideoStatus.READY:
      return <Video className="size-6" />;
    case VideoStatus.DELETED:
      return <Trash2 className="size-6 text-destructive" />;
    default:
      return <Video className="size-6" />;
  }
};

const videoListRefetchIntervalFn = (query: Query<IVideosResponse>) => {
  if (
    query.state.data?.data?.some(
      ({ status }) => status === VideoStatus.GENERATING,
    )
  ) {
    return 10 * 1000;
  }

  return 5 * 60 * 1000;
};

const PreviewAndCode = () => (
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
          <TabsTrigger value="preview">Video</TabsTrigger>
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
        className="mt-0 flex h-full overflow-hidden"
      >
        <Code />
      </TabsContent>
    </Tabs>
  </div>
);

const SkeletonVideoList = () => (
  <>
    <Skeleton className="m-2 min-h-16 w-full rounded-md" />
    <Skeleton className="m-2 min-h-16 w-full rounded-md" />
    <Skeleton className="m-2 min-h-16 w-full rounded-md" />
    <Skeleton className="m-2 min-h-16 w-full rounded-md" />
  </>
);

const NoVideos = () => (
  <div className="flex h-full flex-col content-center items-center justify-center gap-4 p-5">
    <div className="flex items-center justify-center rounded-full bg-accent p-3 text-muted-foreground">
      <Video size={16} />
    </div>
    <p className="text-center text-sm font-medium text-muted-foreground">
      Your generated videos will appear here
    </p>
  </div>
);

const LIMIT = 10;

const queryParams = {
  page: 0,
  limit: LIMIT,
  filter_out_status: VideoStatus.DELETED,
};
const queryKey = ['videos', queryParams];

const VideoList = () => {
  const { video_id, onOpenChange } = useVideoDetailsSheet();
  // TODO: change loading
  const { data: videos, isPending } = useVideosQuery({
    queryKey,
    queryParams,
    refetchInterval: videoListRefetchIntervalFn,
  });

  return (
    <div className="col-span-1 row-span-1 flex flex-col gap-1 rounded-md border border-border bg-background p-4">
      <header className="flex items-center justify-between">
        <b>Generated Videos</b>
        <Button variant="link" asChild className="p-1 text-muted-foreground">
          <Link href="/videos/">
            All Videos
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      </header>
      <Separator />
      <ul className="-ml-2.5 flex h-full flex-col gap-1 overflow-y-scroll">
        {videos ? (
          videos.data.map(
            ({
              video_id,
              video_name,
              status,
              still_image_thumbnail_url,
              data,
            }) => (
              <li
                key={video_id}
                onClick={() => onOpenChange(video_id)}
                className={cn(
                  'flex cursor-pointer gap-4 rounded border-2 border-transparent p-2 focus:border-border',
                  {
                    'pointer-events-none opacity-50 hover:border-transparent':
                      video_id === OPTIMISTIC_VIDEO_ID,
                  },
                )}
              >
                <div className="flex min-h-14 min-w-24 items-center justify-center overflow-hidden rounded border bg-secondary">
                  {still_image_thumbnail_url ? (
                    <img
                      src={still_image_thumbnail_url}
                      alt={video_name || 'Video thumbnail'}
                      className="max-h-13.5 object-contain"
                    />
                  ) : (
                    getIcon(status)
                  )}
                </div>
                <div className="grid w-full">
                  <p className="truncate">{data.script || data.audio_url}</p>
                  <p className="text-muted-foreground">{video_id}</p>
                </div>
              </li>
            ),
          )
        ) : isPending ? (
          // TODO: ADD Empty state
          <SkeletonVideoList />
        ) : (
          <NoVideos />
        )}
      </ul>
      <VideoDetailsSheet id={video_id} onOpenChange={onOpenChange} />
    </div>
  );
};

const useUploadBackgroundMutation = () =>
  useMutation({
    mutationKey: ['uploadBackground'],
    mutationFn: useUploadBackground,
  });

const OPTIMISTIC_VIDEO_ID = '...';

export default function VideoCreatePage() {
  const { t } = useTranslation();
  const { undo, redo } = useVideoGenerateFormUndoHistory(state => state);
  const { mutateAsync: uploadAudio, isPending: isUploadingAudio } =
    useUploadAudioMutation();
  const { mutateAsync: uploadBackground, isPending: isUploadingBackground } =
    useUploadBackgroundMutation();
  const { mutateAsync: createVideo, isPending: isSubmitting } =
    useCreateVideoMutation({
      onMutate: async (body: CreateVideoDto) => {
        await queryClient.cancelQueries({ queryKey });

        const prevData = queryClient.getQueryData(queryKey) as IVideosResponse;
        const newVideo: IVideo = {
          data: {
            script: body.script,
            audio_url: body.audio_url,
          },
          status: VideoStatus.GENERATING,
          video_id: OPTIMISTIC_VIDEO_ID,
          video_name: body.video_name,
          created_at: new Date(),
          updated_at: new Date(),
          status_details: '',
        };

        queryClient.setQueryData(queryKey, (prev: IVideosResponse) => ({
          data: [newVideo, ...prev.data],
          total_count: prev?.total_count + 1,
        }));

        return prevData;
      },
      onError: (_, __, prevData) => {
        queryClient.setQueryData(queryKey, prevData as IVideosResponse);
      },
      onSettled: () => {
        void queryClient.invalidateQueries({ queryKey });
      },
    });

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
    const formFileState = useVideoGenerateFilesStore.getState();

    const createVideoBody = getCreateVideoRequestBody(formState, formFileState);

    try {
      schemaParse(CreateVideoSchema)(createVideoBody);

      try {
        const promises = [];

        if (formState.type === VideoGenerationType.AUDIO) {
          if (!formState.audioUrl && formFileState.audio?.file) {
            // TODO: move to all settled
            promises.push(() =>
              uploadAudio({
                file: formFileState.audio!.file!,
              })
                .then(url => {
                  formState.set({ audioUrl: url });
                  createVideoBody.audio_url = url;
                })
                .catch(e => {
                  toast({
                    title: 'Error',
                    description: "Couldn't upload audio",
                  });
                  throw e;
                }),
            );
          }
        }
        console.log(formState);
        if (formState.withBackground) {
          if (formState.backgroundType === VideoBackgroundType.UPLOAD_FILE) {
            if (
              !formState.backgroundSourceUrl &&
              formFileState.background?.file
            ) {
              promises.push(() =>
                uploadBackground({
                  file: formFileState.background!.file!,
                })
                  .then(url => {
                    formState.set({ backgroundSourceUrl: url });
                    createVideoBody.background_source_url = url;
                  })
                  .catch(e => {
                    toast({
                      title: 'Error',
                      description: "Couldn't upload background",
                    });
                    throw e;
                  }),
              );
            }
          }
        }

        const results = await Promise.allSettled(
          promises.map(promise => promise()),
        );
        if (results.some(result => result.status === 'rejected')) return;

        // TODO: throw 18n error
        await createVideo(createVideoBody);
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

      if (
        paths.some(path => path === 'callback_url' || path === 'background_url')
      )
        formState.set({
          isAdvancedSettingsOpen: true,
        });
    }
  };

  return (
    <Layout className="flex max-h-screen flex-col">
      <LayoutHeader title="Video Generation">
        <CopyApiUrl type="POST" url="video" />
        <LayoutHeaderButtonsBlock>
          <Button className="ml-auto" variant="outline" asChild>
            <Link
              target="_blank"
              href="https://docs.tavusapi.com/api-reference/video-request/create-video"
            >
              Read Docs
            </Link>
          </Button>
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper
        onKeyDown={handleKeyDown}
        wrapperClassName="flex flex-1 h-[calc(100vh-64px)] "
        className="grid grid-cols-2 grid-rows-2 gap-6"
      >
        <div className="col-span-1 row-span-2 flex flex-col gap-4 rounded-md border border-border bg-background p-4">
          <Badge variant="label" className="w-fit text-sm">
            Input
          </Badge>
          <form
            id="createVideoForm"
            onSubmit={handleSubmit}
            className="flex flex-1 flex-col gap-4 overflow-scroll"
          >
            <ReplicaSelect />
            <ScriptAndAudioInputsTab />
            <AdvancedSettingsInputs />
          </form>
          <footer className="flex flex-col items-end">
            <Separator className="mb-4" />
            <div className="flex w-full items-center justify-end gap-2 overflow-hidden">
              <span className="truncate">
                {isUploadingAudio
                  ? 'Uploading audio...'
                  : isUploadingBackground
                    ? 'Uploading background...'
                    : ''}
              </span>
              <Button
                type="submit"
                form="createVideoForm"
                disabled={
                  isSubmitting || isUploadingAudio || isUploadingBackground
                }
              >
                Generate <ArrowRight size={16} className="ml-1" />
              </Button>
            </div>
          </footer>
        </div>
        <PreviewAndCode />
        <VideoList />
      </LayoutWrapper>
    </Layout>
  );
}
