'use client';

import React, { useRef, useState } from 'react';

import { ArrowRight, Clapperboard } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';

import { MediaFileCard } from '@/components/AudioCard';
import { Button } from '@/components/ui/button';
import { Dropzone } from '@/components/ui/dropzone';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast, useToast } from '@/components/ui/use-toast';

import { getVideoDuration } from '@/utils';

import {
  useVideoGenerateFilesStore,
  useVideoGenerateFormStore,
} from '../hooks';

const MAX_FILE_SIZE = 300 * 1024 * 1024;
// const MAX_FILE_SIZE_MB = `${MAX_FILE_SIZE / 1024 / 1024} MB`;

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const BackgroundUrlInput = () => {
  const [value, setValue] = useState('');
  const set = useVideoGenerateFormStore(store => store.set);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleClick = () => {
    if (!isValidUrl(value))
      return toast({
        title: 'Invalid URL',
        description: 'Please enter a valid URL',
      });

    set({ backgroundSourceUrl: value });
    setValue('');
  };

  const handleWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  /*TODO: move to secondary foreground*/
  return (
    <div
      className="w-full cursor-default rounded border border-transparent bg-[#F8FAFC] p-4 dark:border-border dark:bg-transparent"
      onClick={handleWrapperClick}
    >
      <Label
        className="mb-2 inline-block cursor-pointer"
        htmlFor="backgroundUrl"
      >
        Background URL
      </Label>
      <div className="relative w-full">
        <Input
          type="url"
          value={value}
          onChange={handleChange}
          placeholder="https://storage.com/background.mp4"
          name="backgroundUrl"
          className="w-full pr-10"
        />
        {value && (
          <Button
            type="button"
            onClick={handleClick}
            className="absolute right-1 top-1/2 size-8 -translate-y-1/2 p-0"
          >
            <ArrowRight size={16} />
          </Button>
        )}
      </div>
    </div>
  );
};

export const UploadBackgroundTab = () => {
  const { t } = useTranslation();
  const errorIdRef = useRef<string>();
  const { toast, dismiss } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [backgroundSourceUrl, setForm] = useVideoGenerateFormStore(
    useShallow(store => [store.backgroundSourceUrl, store.set]),
  );
  const [background, setFormFiles] = useVideoGenerateFilesStore(
    useShallow(store => [store.background, store.set]),
  );

  const handleClickUpload = () => {
    dismiss(errorIdRef.current);
    inputRef.current?.click();
  };
  const handleChange = async (files: FileList | null) => {
    dismiss(errorIdRef.current);

    const file = files?.[0];

    if (file) {
      if (file.size > MAX_FILE_SIZE)
        return handleError(
          'The file size is too large. Please upload a file smaller than 300MB',
        );

      const data: Parameters<typeof setFormFiles>[0] = {
        background: { file, url: URL.createObjectURL(file) },
      };
      const duration = await getVideoDuration(file).catch(() => null);
      // TODO: add validation for audio length
      if (duration) data.background!.duration = Math.round(duration);

      setFormFiles(data);
    }
  };
  const handleError = (message: string) => {
    const { id } = toast({
      title: t('ui.toast.title.error'),
      description: message,
    });

    errorIdRef.current = id;
  };

  const handleDeleteClick = () => {
    setFormFiles({ background: null });
    setForm({ backgroundSourceUrl: '' });
  };

  return (
    <div className="my-4 h-full">
      {background || backgroundSourceUrl ? (
        <MediaFileCard
          url={background?.url || backgroundSourceUrl!}
          duration={background?.duration}
          name={background?.file?.name}
          onDeleteClick={handleDeleteClick}
        />
      ) : (
        <Dropzone
          ref={inputRef}
          /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
          onChange={handleChange}
          multiple={false}
          onError={handleError}
          /*NOTE: video type added because recorded audio saves as video format*/
          accept="video/mp4, video/webm"
        >
          <div
            className="flex h-full flex-1 cursor-pointer flex-col items-center justify-center p-4"
            onClick={handleClickUpload}
          >
            <div className="mb-4 cursor-pointer rounded-full bg-primary-foreground p-2">
              <Clapperboard className="text-primary" size={16} />
            </div>
            <div className="mb-4 text-center">
              <p className="text-lg font-semibold">
                Click to upload file or drag and drop
              </p>
              <p className="text-sm font-medium text-muted-foreground">
                {/*TODO: ADD Image*/}
                Video file up to 500mb or 30min
              </p>{' '}
            </div>
            <div className="flex h-full max-h-10 min-h-4"></div>
            <BackgroundUrlInput />
          </div>
        </Dropzone>
      )}
    </div>
  );
};
