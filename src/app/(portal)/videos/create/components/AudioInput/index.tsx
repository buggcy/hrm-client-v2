import { AudioCard } from '@/components/AudioCard';
import { Input } from '@/components/ui/input';

import { RecordTab } from './RecordTab';
import { UploadTab } from './UploadTab';
import {
  useVideoGenerateFormStore,
  useVideoGenerateMetadataStore,
} from '../../hooks';
import { AudioTab } from '../../types';

export const AudioInput = () => {
  const [audioUrl, setForm] = useVideoGenerateFormStore(store => [
    store.audioUrl,
    store.set,
  ]);
  const [audioTab, audio, setMetadata] = useVideoGenerateMetadataStore(
    store => [store.audioTab, store.audio, store.set],
  );

  const handleDeleteClick = () => {
    setForm({ audioUrl: '' });
    setMetadata({ audio: null });
  };

  return (
    <>
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
      <Input
        required={!audio && !audioUrl}
        type="file"
        tabIndex={-1}
        className="mx-auto size-0 p-0 opacity-0"
      />
    </>
  );
};
