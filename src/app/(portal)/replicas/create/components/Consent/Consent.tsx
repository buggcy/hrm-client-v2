'use client';
import { useRef } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
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

import { getVideoDuration } from '@/utils';

import { Skip } from '../Skip';
import { VideoPreview } from '../VideoPreview';
import { VideoRecorder } from '../VideoRecorder';
import { ConsentMethod, useReplicaStore } from '../../hooks';

const MAX_FILE_SIZE = 750 * 1024 * 1024;
const MINIMAL_VIDEO_DURATION = 3;

const FormSchema = z.object({
  urlValue: z.string().url({ message: 'Enter a valid URL' }),
});

const Upload = () => {
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
  const consentFile = useReplicaStore(state => state.consentFile);
  const consentURL = useReplicaStore(state => state.consentURL);
  const setActiveStep = useReplicaStore(state => state.setActiveStep);
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
        return handleError('Video must be at least 3 seconds long');
      }

      const data: Parameters<typeof set>[0] = {
        consentFile: file,
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
    set({ consentFile: null, consentURL: '' });
    incompleteStep('consent');
  };

  const handleConfirm = () => {
    completeStep('consent');
    setActiveStep('training');
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
        message: 'Video must be at least 3 seconds long',
      });
    }
    if (duration) {
      return set({ consentURL: urlValue });
    }
  };

  return (
    <div className="size-full flex-1">
      {consentFile || consentURL ? (
        <VideoPreview
          url={consentURL}
          file={consentFile}
          onDelete={handleDelete}
          checkTitle="Confirm these consent video requirements"
          onConfirm={handleConfirm}
        />
      ) : (
        <Dropzone
          ref={inputRef}
          onChange={handleChange}
          multiple={false}
          onError={handleError}
          accept="video/mp4, video/webm, video/quicktime"
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
                  Click to upload your consent video or drag and drop
                </p>
                <p className="mt-2 text-sm font-medium text-muted-foreground">
                  Video file up to 750mb
                  <br />
                  Supported formats: <b>.mp4 .webm .mov</b>
                  <br />
                  Currently, the <b>H.264 codec is required</b> to ensure
                  efficient compression.
                </p>
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
                className="grid w-full items-center gap-1.5 rounded-md bg-secondary-foreground p-4"
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

export const Consent = () => {
  const activeTab = useReplicaStore(state => state.consentMethod);
  const set = useReplicaStore(state => state.set);
  return (
    <Tabs
      value={activeTab}
      onValueChange={(value: string) => {
        set({ consentMethod: value as ConsentMethod });
      }}
      className="flex w-full flex-1 flex-col items-center justify-start gap-6"
    >
      <TabsList className="w-fit">
        <TabsTrigger className="px-5 sm:px-9" value={ConsentMethod.RECORD}>
          Record
        </TabsTrigger>
        <TabsTrigger className="px-5 sm:px-9" value={ConsentMethod.UPLOAD}>
          Upload
        </TabsTrigger>
        <TabsTrigger className="px-5 sm:px-9" value={ConsentMethod.SKIP}>
          Skip
        </TabsTrigger>
      </TabsList>
      <TabsContent value={ConsentMethod.RECORD} className="size-full flex-1">
        <VideoRecorder />
      </TabsContent>
      <TabsContent value={ConsentMethod.UPLOAD} className="size-full flex-1">
        <Upload />
      </TabsContent>
      <TabsContent value={ConsentMethod.SKIP} className="size-full flex-1">
        <Skip />
      </TabsContent>
    </Tabs>
  );
};
