import React from 'react';

import {
  DownloadIcon,
  PauseIcon,
  PlayIcon,
  Trash2,
  Volume2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useAudio } from '@/hooks';
import { formatBytes, formatTime } from '@/utils';

import { useVideoGenerateMetadataStore } from '../../hooks';

export const AudioPreview = () => {
  const [audio, set] = useVideoGenerateMetadataStore(store => [
    store.audio,
    store.set,
  ]);
  const { isPlaying, toggle } = useAudio(audio?.url || '');

  const handleDelete = () => {
    set({ audio: null });
  };

  return (
    <div className="flex items-center rounded-lg border p-4 shadow-sm">
      <div className="rounded-full bg-primary-foreground p-2">
        <Volume2 className="text-primary" size={16} />
      </div>
      <div className="ml-3 flex  flex-col overflow-hidden">
        <span className="max-w-full truncate font-medium">
          {audio?.file?.name || audio?.url}
        </span>
        <span className="text-sm text-gray-500">
          {audio?.duration ? `${formatTime(audio?.duration)} | ` : ''}
          {audio?.file?.size && formatBytes(audio?.file?.size, 1)}
        </span>
      </div>
      <div className="ml-auto flex space-x-2">
        <Button
          type="button"
          variant="ghost"
          className="size-10 rounded-full border-DEFAULT  p-2 text-foreground hover:border-transparent hover:bg-primary-foreground hover:text-primary"
          onClick={toggle}
        >
          {isPlaying ? (
            <PauseIcon className="size-4 fill-current" />
          ) : (
            <PlayIcon className="size-4 fill-current" />
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="size-10 p-2 text-foreground hover:bg-transparent hover:text-primary"
          asChild
        >
          <a href={audio?.url} download>
            <DownloadIcon className="size-5" />
          </a>
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="size-10 p-2 text-muted-foreground hover:bg-transparent hover:text-destructive"
          onClick={handleDelete}
        >
          <Trash2 className="size-5 " />
        </Button>
      </div>
    </div>
  );
};
