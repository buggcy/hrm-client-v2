'use client';

import React, { useRef, useState } from 'react';

import { ArrowRight, UploadIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Dropzone } from '@/components/ui/dropzone';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast, useToast } from '@/components/ui/use-toast';

import { getVideoDuration } from '@/utils';

import {
  useVideoGenerateFilesStore,
  useVideoGenerateFormStore,
} from '../../hooks';
import { AudioTab } from '../../types';

const MAX_AUDIO_SIZE = 50 * 1024 * 1024;
const MAX_AUDIO_SIZE_MB = `${MAX_AUDIO_SIZE / 1024 / 1024} MB`;

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const AudioUrlInput = () => {
  const [value, setValue] = useState('');
  const set = useVideoGenerateFormStore(store => store.set);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleClick = () => {
    if (!isValidUrl(value))
      return toast({
        variant: 'error',
        title: 'Invalid URL',
        description: 'Please enter a valid URL',
      });
    set({ audioUrl: value });
    setValue('');
  };

  /*TODO: move to secondary foreground*/
  return (
    <div className="w-full rounded border border-transparent bg-[#F8FAFC] p-4 dark:border-border dark:bg-transparent">
      <Label className="mb-2 inline-block cursor-pointer" htmlFor="audioUrl">
        Audio URL
      </Label>
      <div className="relative w-full">
        <Input
          type="url"
          value={value}
          onChange={handleChange}
          placeholder="https://storage.com/audio.mp3"
          name="audioUrl"
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

export const UploadTab = () => {
  const { t } = useTranslation();
  const errorIdRef = useRef<string>();
  const { toast, dismiss } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const setForm = useVideoGenerateFormStore(store => store.set);
  const setFormFiles = useVideoGenerateFilesStore(store => store.set);

  const handleClickUpload = () => {
    dismiss(errorIdRef.current);
    inputRef.current?.click();
  };
  const handleClickRecord = (e: React.MouseEvent) => {
    e.stopPropagation();
    setForm({ audioTab: AudioTab.RECORD });
  };
  const handleChange = async (files: FileList | null) => {
    dismiss(errorIdRef.current);

    const file = files?.[0];

    if (file) {
      if (file.size > MAX_AUDIO_SIZE)
        return handleError(
          t('portal.videos.create.audio.input.error.large.description', {
            size: MAX_AUDIO_SIZE_MB,
          }),
        );

      const data: Parameters<typeof setFormFiles>[0] = {
        audio: { file, url: URL.createObjectURL(file) },
      };
      const duration = await getVideoDuration(file).catch(() => null);

      if (duration) data.audio!.duration = Math.round(duration);

      setFormFiles(data);
    }
  };
  const handleError = (message: string) => {
    const { id } = toast({
      variant: 'error',
      title: t('ui.toast.title.error'),
      description: message,
    });

    errorIdRef.current = id;
  };

  return (
    <div className="my-4 h-full">
      <Dropzone
        ref={inputRef}
        onChange={handleChange}
        multiple={false}
        onError={handleError}
        /*NOTE: video type added because recorded audio saves as video format*/
        accept="audio/mp4, audio/webm, audio/wav, audio/mp3, video/mp4, video/webm, video/wav, video/mp3"
      >
        <div className="flex h-full flex-1 flex-col items-center justify-center p-4">
          <div
            className="mb-4 cursor-pointer rounded-full bg-primary-foreground p-2"
            onClick={handleClickUpload}
          >
            <UploadIcon className="text-primary" size={16} />
          </div>
          <div className="mb-4 text-center">
            <p className="text-lg font-semibold">
              {t('portal.videos.create.audio.input.title')}
            </p>
            <p className="text-sm font-medium text-muted-foreground">
              {t('portal.videos.create.audio.input.description', {
                size: MAX_AUDIO_SIZE_MB,
              })}
            </p>{' '}
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Button type="button" variant="outline" onClick={handleClickUpload}>
              {t('portal.videos.create.audio.button.upload')}
            </Button>
            <Button type="button" variant="outline" onClick={handleClickRecord}>
              {t('portal.videos.create.audio.button.record')}
            </Button>
          </div>
          <div className="flex h-full max-h-10 min-h-4"></div>
          <AudioUrlInput />
        </div>
      </Dropzone>
    </div>
  );
};
