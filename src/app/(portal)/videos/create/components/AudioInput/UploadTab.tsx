import React, { useRef } from 'react';

import { UploadIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Dropzone } from '@/components/ui/dropzone';
import { useToast } from '@/components/ui/use-toast';

import { getVideoDuration } from '@/utils';

import { useVideoGenerateMetadataStore } from '../../hooks';
import { AudioTab } from '../../types';

const MAX_AUDIO_SIZE = 50 * 1024 * 1024;
const MAX_AUDIO_SIZE_MB = `${MAX_AUDIO_SIZE / 1024 / 1024} MB`;

export const UploadTab = () => {
  const { t } = useTranslation();
  const errorIdRef = useRef<string>();
  const { toast, dismiss } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const set = useVideoGenerateMetadataStore(store => store.set);

  const handleClickUpload = () => {
    dismiss(errorIdRef.current);
    inputRef.current?.click();
  };
  const handleClickRecord = (e: React.MouseEvent) => {
    e.stopPropagation();
    set({ audioTab: AudioTab.RECORD });
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

      const data: Parameters<typeof set>[0] = {
        audio: { file, url: URL.createObjectURL(file) },
      };
      const duration = await getVideoDuration(file).catch(() => null);

      if (duration) data.audio!.duration = Math.round(duration);

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

  return (
    <div>
      <Dropzone
        ref={inputRef}
        /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
        onChange={handleChange}
        multiple={false}
        onError={handleError}
        /*NOTE: video type added because recorded audio saves as video format*/
        accept="audio/mp4, audio/webm, video/mp4, video/webm"
      >
        <div className="flex flex-1 flex-col items-center justify-center gap-y-4 ">
          <div
            className="cursor-pointer rounded-full bg-primary-foreground p-2"
            onClick={handleClickUpload}
          >
            <UploadIcon className="text-primary" size={16} />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold">
              {t('portal.videos.create.audio.input.title')}
            </p>
            <p className="text-sm font-medium text-muted-foreground">
              {t('portal.videos.create.audio.input.description', {
                size: MAX_AUDIO_SIZE_MB,
              })}
            </p>{' '}
          </div>
          <div className="flex space-x-4">
            <Button type="button" variant="outline" onClick={handleClickUpload}>
              {t('portal.videos.create.audio.button.upload')}
            </Button>
            <Button type="button" variant="outline" onClick={handleClickRecord}>
              {t('portal.videos.create.audio.button.record')}
            </Button>
          </div>
        </div>
      </Dropzone>
    </div>
  );
};
