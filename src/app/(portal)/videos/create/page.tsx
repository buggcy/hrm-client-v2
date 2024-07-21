'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import { useMutation } from '@tanstack/react-query';
import { AxiosError, AxiosProgressEvent } from 'axios';
import {
  ArrowRight,
  ChevronRight,
  FileText,
  Headphones,
  Info,
  Loader,
  Loader2,
  Trash2,
  TriangleAlert,
  Undo2,
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
  AccordionTriggerLeftArrow,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SimpleTooltip } from '@/components/ui/tooltip';
import { toast } from '@/components/ui/use-toast';

import {
  useVideoDetailsSheet,
  VideoDetailsSheet,
} from '@/app/(portal)/videos/components/VideoDetailsSheet';
import { ReplicaSelect } from '@/app/(portal)/videos/create/components/ReplicaSelect';
import { UploadBackgroundTab } from '@/app/(portal)/videos/create/components/UploadBackground';
import {
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
  useVideosQueryRefetchInterval,
} from '@/hooks';
import { useUserQuotasQuery } from '@/hooks/useBilling';
import { queryClient } from '@/libs';
import { cn, getFilenameFromUrl, portalApi, schemaParse } from '@/utils';

import { AudioInput } from './components/AudioInput';
import { ScriptInput } from './components/ScriptInput';
import { useVideoGenerateFilesStore } from './hooks';
import { VideoBackgroundType, VideoGenerationType } from './types';

import { IVideo, ReplicaType, VideoStatus } from '@/types';

const tabsTriggerClassName =
  'inline-flex items-center  justify-center whitespace-nowrap py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50  relative h-9 rounded-none border-b-2 border-b-transparent !bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none  data-[state=active]:border-b-black data-[state=active]:focus:border-b-primary data-[state=active]:hover:border-b-primary focus:!text-primary hover:!text-primary data-[state=active]:text-foreground data-[state=active]:border-foreground data-[state=active]:shadow-none';

const ScriptAndAudioInputsTab = () => {
  const { t } = useTranslation();
  const [type, set, replicaId] = useVideoGenerateFormStore(
    useShallow(store => [store.type, store.set, store.replicaId]),
  );
  const { data: replica } = useReplicaQuery(replicaId);
  const isStockReplica = replica?.replica_type === ReplicaType.STUDIO;

  useEffect(() => {
    if (isStockReplica && type === VideoGenerationType.AUDIO) {
      set({ type: VideoGenerationType.SCRIPT });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStockReplica]);

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
        <SimpleTooltip
          disabled={!isStockReplica}
          tooltipContent={
            'Audio generation is not available for stock replicas'
          }
        >
          <div>
            <TabsTrigger
              disabled={isStockReplica}
              className={tabsTriggerClassName}
              asChild
              value={VideoGenerationType.AUDIO}
            >
              <Button className="flex items-center space-x-1 px-0">
                <Headphones size={16} />
                <span>{t('portal.videos.create.tabs.audio')}</span>
              </Button>
            </TabsTrigger>
          </div>
        </SimpleTooltip>
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
  const [name, callbackUrl, isAdvancedSettingsOpen, set, withBackground] =
    useVideoGenerateFormStore(
      useShallow(store => [
        store.name,
        store.callbackUrl,
        store.isAdvancedSettingsOpen,
        store.set,
        store.withBackground,
      ]),
    );
  const setFiles = useVideoGenerateFilesStore(state => state.set);
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

  const isAdvanceFormDirty = name || callbackUrl || withBackground;

  const onClickClearForm = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    set({
      name: '',
      callbackUrl: '',
      withBackground: false,
      backgroundType: VideoBackgroundType.WEBSITE_URL,
      backgroundUrl: '',
      backgroundSourceUrl: '',
    });
    setFiles({
      background: null,
    });
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
        <AccordionTriggerLeftArrow className="h-16 p-4 !ring-primary hover:text-primary hover:no-underline">
          Advanced settings
          {isAdvancedSettingsOpen && isAdvanceFormDirty && (
            <SimpleTooltip tooltipContent="Clear Form">
              <Button
                variant="ghost"
                type="button"
                className="-mr-2 ml-auto"
                onClick={onClickClearForm}
              >
                <Undo2 className="size-4" />
              </Button>
            </SimpleTooltip>
          )}
        </AccordionTriggerLeftArrow>
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

const getCreateVideoRequestBody = (
  formState: IVideoGenerateFormStore,
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
    if (
      formState.backgroundType === VideoBackgroundType.WEBSITE_URL &&
      formState.backgroundUrl
    )
      result.background_url = formState.backgroundUrl;
    else if (
      formState.backgroundType === VideoBackgroundType.UPLOAD_FILE &&
      formState.backgroundSourceUrl
    ) {
      result.background_source_url = formState.backgroundSourceUrl;
    }
  }
  return result as CreateVideoDto;
};

const Code = () => {
  const formStore = useVideoGenerateFormStore();
  const formFileStore = useVideoGenerateFilesStore();
  const body = useMemo(() => {
    const result = getCreateVideoRequestBody(formStore);

    if (formStore.type === VideoGenerationType.AUDIO) {
      result.audio_url ??= '<audio_url>';
    }
    if (
      formStore.backgroundType === VideoBackgroundType.UPLOAD_FILE &&
      formFileStore.background?.file
    )
      result.background_source_url ??= '<background_source_url>';

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

// TODO: add mock url
const MOCK_WEBSITE_URL_PREVIEW_SRC = 'https://www.tavus.io/';

const Preview = () => {
  const [
    replicaId,
    backgroundSourceUrl,
    backgroundUrl,
    backgroundType,
    withBackground,
  ] = useVideoGenerateFormStore(
    useShallow(state => [
      state.replicaId,
      state.backgroundSourceUrl,
      state.backgroundUrl,
      state.backgroundType,
      state.withBackground,
    ]),
  );
  const background = useVideoGenerateFilesStore(state => state.background);
  const { data } = useReplicaQuery(replicaId);

  const hasBackgroundPreview =
    withBackground &&
    !!(backgroundType === VideoBackgroundType.WEBSITE_URL
      ? backgroundUrl
      : backgroundSourceUrl || background?.url);
  const backgroundSrc =
    backgroundType === VideoBackgroundType.WEBSITE_URL
      ? MOCK_WEBSITE_URL_PREVIEW_SRC
      : backgroundSourceUrl || background?.url;

  return (
    <div className="pointer-events-none relative flex h-full items-center justify-center overflow-hidden rounded">
      {hasBackgroundPreview ? (
        <VideoWithBackground
          src={data?.thumbnail_video_url as string}
          backgroundSrc={backgroundSrc as string}
          noBackgroundContent={
            backgroundType === VideoBackgroundType.WEBSITE_URL
              ? 'Website Preview not available'
              : 'Background preview not available'
          }
        />
      ) : (
        <>
          <Loader className="absolute z-0 mb-6 size-8 animate-spin" />
          <div className="relative z-10 h-full">
            <video
              className="aspect-video h-[inherit] rounded"
              preload="auto"
              src={data?.thumbnail_video_url as string}
            />
          </div>
        </>
      )}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center space-x-2 rounded-md bg-white/10 px-4 py-2 backdrop-blur-sm">
        <span className="whitespace-nowrap text-sm font-medium text-white text-opacity-80">
          Video Preview
        </span>
        <Info size={16} className="text-white text-opacity-80" />
      </div>
    </div>
  );
};

const VideoWithBackground = ({
  src,
  backgroundSrc,
  noBackgroundContent,
}: {
  src: string;
  backgroundSrc: string;
  noBackgroundContent?: string;
}) => {
  const [bgLoading, setBgLoading] = useState(true);
  const [bgError, setBgError] = useState(false);

  useEffect(() => {
    setBgLoading(true);
    setBgError(false);
  }, [backgroundSrc]);

  return (
    <div className="relative z-10 flex size-full overflow-hidden rounded">
      {/* Background Video or Fallback */}
      {!bgError ? (
        <video
          src={backgroundSrc}
          autoPlay
          loop
          muted
          className={`inset-0 aspect-video size-full bg-black ${bgLoading ? 'hidden' : ''}`}
          onLoadedData={() => setBgLoading(false)}
          onError={() => setBgError(true)}
        />
      ) : (
        <div className="absolute inset-0 flex h-full items-center justify-center bg-border">
          <p>{noBackgroundContent || 'Background preview not available'}</p>
        </div>
      )}

      {bgLoading && !bgError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <Loader className="size-6 animate-spin" />
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Circular Video */}
      <div className="absolute bottom-2 left-2 aspect-square w-1/5 overflow-hidden rounded-full bg-border shadow-lg">
        <video
          src={src}
          autoPlay
          loop
          muted
          className={`relative z-20 aspect-video size-full object-cover`}
        />
        {/* Circular Video Loader */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <Loader className="size-6 animate-spin" />
        </div>
      </div>
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
  const {
    data: videos,
    isPending,
    isLoading,
    isFetching,
  } = useVideosQuery({
    queryKey,
    queryParams,
    refetchInterval: useVideosQueryRefetchInterval,
    refetchOnWindowFocus: true,
  });

  return (
    <div className="col-span-1 row-span-1 flex flex-col gap-1 rounded-md border border-border bg-background p-4">
      <header className="flex items-center justify-between">
        <p className="font-medium">
          Generated Videos
          {isFetching && !isLoading && (
            <Loader className="ml-2 inline size-5 animate-spin" />
          )}
        </p>
        <Button variant="link" asChild className="p-1 text-muted-foreground">
          <Link href="/videos/">
            All Videos
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      </header>
      <Separator />
      <ul className="-ml-2.5 flex h-full flex-col gap-1 overflow-y-auto overflow-x-hidden">
        {videos?.data?.length ? (
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
                  <p className="truncate">
                    {data.script ||
                      getFilenameFromUrl(data.audio_url!) ||
                      data.audio_url}
                  </p>
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

const noQuotasTooltipContent = (
  <p>
    {"You don't have enough quotas. Please "}
    <Button asChild variant="link" className="p-0">
      <Link href="/billing">upgrade your plan</Link>
    </Button>{' '}
    to continue.
  </p>
);

// TODO: add payment required case
// const paymentRequiredTooltipContent = (
//   <p>
//     Your payment is required to continue. Please{' '}
//     <Button asChild variant="link" className="p-0">
//       <Link href="/billing">upgrade your plan</Link>
//     </Button>{' '}
//     to continue.
//   </p>
// );

const OPTIMISTIC_VIDEO_ID = '...';

export default function VideoCreatePage() {
  const { data: quotas, isError } = useUserQuotasQuery();
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
          created_at: '',
          updated_at: '',
          status_details: '',
        };

        queryClient.setQueryData(queryKey, (prev: IVideosResponse) => ({
          data: [newVideo, ...(prev?.data || [])],
          total_count: (prev?.total_count || 0) + 1,
        }));

        return prevData;
      },
      onError: (error, __, prevData) => {
        queryClient.setQueryData(queryKey, prevData || null);

        if ((error as unknown as AxiosError)?.response?.status === 402) {
          // TODO: show dialog on 402
          toast({
            variant: 'error',
            title: 'Out of Quotas (402)',
            description:
              "You don't have enough quotas. Please check your billing account. If problem persists, please contact support.",
          });
        } else {
          toast({
            variant: 'error',
            title:
              "Error while creating video. Couldn't start video generation",
            description: error.message,
          });
        }
      },
      onSettled: () => {
        void queryClient.invalidateQueries({ queryKey });
      },
      onSuccess: () => {
        toast({
          variant: 'success',
          title: 'Start video generation 🚀',
          description:
            'Your video is being processed. You can check the status in the list below.',
        });
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
    const createVideoBody = getCreateVideoRequestBody(formState);

    try {
      validateVideoBody();

      toast({
        variant: 'progress',
        title: 'Processing video creation request 🎞️',
      });

      await uploadFilesAndReplaceFormUrls();
      await createVideo(createVideoBody);
    } catch (e) {
      console.error(e);
    }

    function validateVideoBody() {
      try {
        schemaParse(CreateVideoSchema)(createVideoBody);
      } catch (_error) {
        const { issues } = _error as z.ZodError<CreateVideoSchema>;
        const message = issues.map(issue => issue.message).join(',');
        const paths = issues.flatMap(issue => issue.path[0]);

        toast({
          title: 'Error',
          description: message,
        });

        if (
          paths.some(
            path => path === 'callback_url' || path === 'background_url',
          )
        )
          formState.set({
            isAdvancedSettingsOpen: true,
          });

        throw new Error('Invalid form data');
      }
    }

    async function uploadFilesAndReplaceFormUrls() {
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
                  variant: 'error',
                  title: 'Error while uploading audio',
                  description: 'Try again or use a different audio file',
                });
                throw e;
              }),
          );
        }
      }

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
                    variant: 'error',
                    title: "Couldn't upload background",
                    description: 'Try again or use a different background file',
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

      if (results.some(result => result.status === 'rejected'))
        throw new Error('Failed to upload files');
    }
  };
  const isOutOfVideoQuotas = isError
    ? false
    : !(quotas ? quotas.video?.isAllowed : true);
  const isGenerating =
    isSubmitting || isUploadingAudio || isUploadingBackground;

  return (
    <Layout className="flex max-h-screen flex-col">
      <LayoutHeader title="Video Generation" className="hidden sm:flex">
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
        wrapperClassName="flex flex-1 h-[calc(100vh-64px)]"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:grid-rows-2"
      >
        <div className="col-span-1 row-span-2 flex h-[calc(100svh-100px)] flex-col gap-4 rounded-md border border-border bg-background p-4 sm:h-[initial]">
          <Badge variant="label" className="w-fit text-sm">
            Input
          </Badge>
          <form
            id="createVideoForm"
            onSubmit={handleSubmit}
            className="no-scrollbar flex flex-1 flex-col gap-4 overflow-y-scroll"
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
              <SimpleTooltip
                disabled={!isOutOfVideoQuotas && !isGenerating}
                tooltipContent={
                  isGenerating
                    ? 'Generating'
                    : isOutOfVideoQuotas
                      ? noQuotasTooltipContent
                      : ''
                }
              >
                <div>
                  <Button
                    type="submit"
                    form="createVideoForm"
                    disabled={isGenerating || isOutOfVideoQuotas}
                  >
                    Generate{' '}
                    <span className="size-4">
                      {isGenerating ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <ArrowRight size={16} />
                      )}
                    </span>
                  </Button>
                </div>
              </SimpleTooltip>
            </div>
          </footer>
        </div>
        <PreviewAndCode />
        <VideoList />
      </LayoutWrapper>
    </Layout>
  );
}
