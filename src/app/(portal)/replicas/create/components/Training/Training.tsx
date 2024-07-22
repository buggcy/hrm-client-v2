'use client';
import { useMemo, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { ArrowRight, Clapperboard } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Dropzone } from '@/components/ui/dropzone';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

import { getVideoDuration, portalApi } from '@/utils';

import { VideoPreview } from '../VideoPreview';
import { useReplicaStore, VideoMethod } from '../../hooks';

const MAX_FILE_SIZE = 750 * 1024 * 1024;
const MINIMAL_VIDEO_DURATION = 60;

const FormSchema = z.object({
  urlValue: z.string().url({ message: 'Enter a valid URL' }),
});

import { AxiosProgressEvent } from 'axios';

import { ReplicaModel, useCreateReplicaMutation } from '@/hooks';

import { LoaderBlock } from '../LoaderBlock';
import { ReplicaCreated } from '../ReplicaCreated';
import { VideoRecorderTraining } from '../VideoRecorderTraining';

export const useAxiosProgress = () => {
  const [progress, setProgress] = useState(0);

  return {
    progress,
    onUploadProgress: (ev: AxiosProgressEvent) =>
      setProgress(Math.round((ev.loaded * 100) / (ev.total ?? 100))),
  };
};

type onUploadProgress = (progress: AxiosProgressEvent) => void;

const uploadVideo = ({
  file,
  onUploadProgress,
}: {
  file: File;
  onUploadProgress?: onUploadProgress;
}) => {
  const formData = new FormData();

  formData.append('file', file);

  return portalApi.post<unknown, string>(
    // TODO: change to replica folder
    `/v1/uploads/file/developer-portal-audio`,
    formData,
    {
      onUploadProgress,
    },
  );
};

const useUploadVideo = (key: string) => {
  return useMutation({
    mutationKey: [key],
    mutationFn: uploadVideo,
  });
};
const useSubmitReplica = () => {
  // TODO: add error handling
  const [
    consentMethod,
    consentFile,
    consentRecordFile,
    consentURL,
    trainingMethod,
    trainingFile,
    trainingRecordFile,
    trainingURL,
  ] = useReplicaStore(state => [
    state.consentMethod,
    state.consentFile,
    state.consentRecordFile,
    state.consentURL,
    state.trainingMethod,
    state.trainingFile,
    state.trainingRecordFile,
    state.trainingURL,
  ]);
  const { onUploadProgress: onConsentProgress, progress: consentProgress } =
    useAxiosProgress();
  const { onUploadProgress: onTrainingProgress, progress: trainingProgress } =
    useAxiosProgress();
  const {
    mutateAsync: uploadConsent,
    isPending: isConsentLoading,
    isSuccess: isConsentSuccess,
  } = useUploadVideo('consent');
  const {
    mutateAsync: uploadTrain,
    isPending: isTrainingLoading,
    isSuccess: isTrainingSuccess,
  } = useUploadVideo('training');
  const {
    data: createdReplica,
    mutate: createReplica,
    isPending: isSubmitLoading,
  } = useCreateReplicaMutation();

  const consentFileValue = useMemo(() => {
    if (consentMethod === VideoMethod.UPLOAD && consentFile?.file) {
      return consentFile?.file;
    }
    if (consentMethod === VideoMethod.RECORD && consentRecordFile) {
      return consentRecordFile?.file;
    }
    return null;
  }, [consentMethod, consentFile, consentRecordFile]);

  const trainingFileValue = useMemo(() => {
    if (trainingMethod === VideoMethod.UPLOAD && trainingFile?.file) {
      return trainingFile.file;
    }
    if (trainingMethod === VideoMethod.RECORD && trainingRecordFile) {
      return trainingRecordFile.file;
    }
    return null;
  }, [trainingMethod, trainingFile, trainingRecordFile]);

  const onSubmit = async () => {
    const data = {
      consent_video_url: '',
      train_video_url: '',
      model_name: ReplicaModel.PHOENIX_2,
    };

    if (consentFileValue) {
      const consentResponseUrl = await uploadConsent({
        file: consentFileValue,
        onUploadProgress: onConsentProgress,
      });
      data.consent_video_url = consentResponseUrl;
    } else {
      data.consent_video_url = consentURL!;
    }

    if (trainingFileValue) {
      const trainingResponseUrl = await uploadTrain({
        file: trainingFileValue,
        onUploadProgress: onTrainingProgress,
      });
      data.train_video_url = trainingResponseUrl;
    } else {
      data.train_video_url = trainingURL!;
    }

    createReplica(data);
  };

  return {
    isConsentSuccess,
    consentProgress,
    isConsentLoading,
    isTrainingSuccess,
    trainingProgress,
    isTrainingLoading,
    isSubmitLoading,
    createdReplica,
    onSubmit,
  };
};

const Upload = ({ onSubmit }: { onSubmit: () => Promise<void> }) => {
  const { t } = useTranslation();
  const errorIdRef = useRef<string>();
  const { toast, dismiss } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      urlValue: '',
    },
  });
  const url = useReplicaStore(state => state.trainingFile?.url);
  const trainingURL = useReplicaStore(state => state.trainingURL);
  const completeStep = useReplicaStore(state => state.completeStep);
  const incompleteStep = useReplicaStore(state => state.incompleteStep);
  const set = useReplicaStore(state => state.set);

  const handleClickUpload = () => {
    dismiss(errorIdRef.current);
    inputRef.current?.click();
  };

  const handleChange = async (files: FileList | null) => {
    dismiss(errorIdRef.current);

    const file = files?.[0];

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        return handleError(
          'The file size is too large. Please upload a file smaller than 300MB',
        );
      }

      const duration = await getVideoDuration(file).catch(() => null);
      if (duration && duration < MINIMAL_VIDEO_DURATION) {
        return handleError('Video must be at least 1min long');
      }

      const data: Parameters<typeof set>[0] = {
        trainingFile: {
          file,
          url: URL.createObjectURL(file),
        },
      };

      set(data);
    }
  };

  const handleError = (message: string) => {
    const { id } = toast({
      title: t('ui.toast.title.error'),
      description: message,
    });

    errorIdRef.current = id;
  };

  const handleWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleDelete = () => {
    set({ trainingFile: null, trainingURL: '' });
    incompleteStep('training');
  };

  const handleConfirm = () => {
    completeStep('training');
    void onSubmit();
  };

  const handleSubmit = async ({ urlValue }: z.infer<typeof FormSchema>) => {
    const duration = await getVideoDuration(urlValue).catch(() => {
      form.setError('urlValue', {
        type: 'manual',
        message: 'URL is invalid or video is not accessible',
      });
    });
    if (duration && duration < MINIMAL_VIDEO_DURATION) {
      return form.setError('urlValue', {
        type: 'manual',
        message: 'Video must be at least 1 min long',
      });
    }
    if (duration) {
      return set({ trainingURL: urlValue });
    }
  };

  return (
    <div className="size-full flex-1">
      {url || trainingURL ? (
        <VideoPreview
          url={url || trainingURL!}
          onDelete={handleDelete}
          checkTitle="Confirm these training video requirements"
          onConfirm={handleConfirm}
        />
      ) : (
        <Dropzone
          ref={inputRef}
          onChange={handleChange}
          multiple={false}
          onError={handleError}
          accept="video/mp4, video/webm"
        >
          <div
            className="flex size-full flex-1 cursor-pointer flex-col items-center justify-between p-4"
            onClick={handleClickUpload}
          >
            <div className="flex flex-1 flex-col items-center justify-center">
              <div className="mb-4 cursor-pointer rounded-full bg-primary-foreground p-2">
                <Clapperboard className="text-primary" size={16} />
              </div>
              <div className="mb-4 text-center">
                <p className="text-lg font-semibold">
                  Click to upload your training video or drag and drop
                </p>
                <p className="text-sm font-medium text-muted-foreground">
                  {/*TODO: ADD Image*/}
                  Video file up to 750mb or 30min
                </p>{' '}
              </div>
            </div>
            <div className="w-full">
              <div className="mb-4 flex w-full items-center gap-4">
                <span className="h-px w-full bg-border"></span>
                <span className="text-xs font-medium text-muted-foreground">
                  OR
                </span>
                <span className="h-px w-full bg-border"></span>
              </div>
              <div
                className="grid w-full items-center gap-1.5 rounded-md bg-secondary p-4"
                onClick={handleWrapperClick}
              >
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="relative w-full space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="urlValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Video URL</FormLabel>
                          <FormControl className="relative">
                            <Input
                              className="relative pr-10"
                              placeholder="https://drive.google.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                          <Button
                            className="absolute right-1 top-7 size-8 p-0"
                            type="submit"
                          >
                            <ArrowRight className="size-4" />
                          </Button>
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </Dropzone>
      )}
    </div>
  );
};

export const Training = () => {
  const {
    consentProgress,
    isConsentLoading,
    trainingProgress,
    isTrainingLoading,
    isSubmitLoading,
    isConsentSuccess,
    isTrainingSuccess,
    createdReplica,
    onSubmit,
  } = useSubmitReplica();
  const trainingMethod = useReplicaStore(state => state.trainingMethod);
  const set = useReplicaStore(state => state.set);
  const isLoading = isConsentLoading || isTrainingLoading || isSubmitLoading;

  return (
    <>
      {isLoading && (
        <LoaderBlock
          isConsentLoading={isConsentLoading}
          consentProgress={consentProgress}
          isConsentSuccess={isConsentSuccess}
          isTrainingLoading={isTrainingLoading}
          trainingProgress={trainingProgress}
          isTrainingSuccess={isTrainingSuccess}
          isSubmitLoading={isSubmitLoading}
        />
      )}
      {createdReplica && <ReplicaCreated />}

      {!isLoading && !createdReplica && (
        <Tabs
          value={trainingMethod}
          onValueChange={(value: string) => {
            set({ trainingMethod: value as VideoMethod });
          }}
          className="flex w-full flex-1 flex-col items-center justify-start gap-6"
        >
          <TabsList className="w-fit">
            <TabsTrigger className="px-9" value="record">
              Record
            </TabsTrigger>
            <TabsTrigger className="px-9" value="upload">
              Upload
            </TabsTrigger>
          </TabsList>
          <TabsContent value="record" className="size-full flex-1">
            <VideoRecorderTraining onSubmit={onSubmit} />
          </TabsContent>
          <TabsContent value="upload" className="size-full flex-1">
            <Upload onSubmit={onSubmit} />
          </TabsContent>
        </Tabs>
      )}
    </>
  );
};
