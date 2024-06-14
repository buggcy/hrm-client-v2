import { Input } from '@/components/ui/input';

import { AudioPreview } from './AudioPreview';
import { RecordTab } from './RecordTab';
import { UploadTab } from './UploadTab';
import {
  useVideoGenerateFormStore,
  useVideoGenerateMetadataStore,
} from '../../hooks';
import { AudioTab } from '../../types';

export const AudioInput = () => {
  const [audioTab, audio] = useVideoGenerateMetadataStore(store => [
    store.audioTab,
    store.audio,
  ]);
  const audioUrl = useVideoGenerateFormStore(store => store.audioUrl);

  return (
    <>
      {audio ? (
        <AudioPreview />
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
