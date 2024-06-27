import { useShallow } from 'zustand/react/shallow';

import { AudioCard } from '@/components/AudioCard';
import { Input } from '@/components/ui/input';

import { RecordTab } from './RecordTab';
import { UploadTab } from './UploadTab';
import {
  useVideoGenerateFilesStore,
  useVideoGenerateFormStore,
} from '../../hooks';
import { AudioTab } from '../../types';

export const AudioInput = () => {
  const [audioUrl, audioTab, setForm] = useVideoGenerateFormStore(
    useShallow(store => [store.audioUrl, store.audioTab, store.set]),
  );
  const [audio, setFormFiles] = useVideoGenerateFilesStore(
    useShallow(store => [store.audio, store.set]),
  );

  const handleDeleteClick = () => {
    setForm({ audioUrl: '' });
    setFormFiles({ audio: null });
  };

  return (
    <div className="relative h-full">
      <Input
        required={!audio && !audioUrl}
        type="file"
        tabIndex={-1}
        className="absolute inset-x-0 top-1/2 mx-auto size-0 -translate-y-1/2 p-0 opacity-0"
      />
      {audio || audioUrl ? (
        <AudioCard
          url={audio?.url || audioUrl!}
          duration={audio?.duration}
          // TODO: add function to extract filename from url
          name={audio?.file?.name}
          size={audio?.file?.size}
          onDeleteClick={handleDeleteClick}
        />
      ) : audioTab === AudioTab.RECORD ? (
        <RecordTab />
      ) : (
        <UploadTab />
      )}
    </div>
  );
};
