import { FC } from 'react';

import { AudioCard } from '@/components/AudioCard';
import { ScriptTextArea } from '@/components/ScriptTextArea';

import { IVideo } from '@/types';

export const VideoDataBlock: FC<{
  data?: IVideo['data'];
}> = ({ data }) => {
  const { script, audio_url } = data || {};

  return (
    <>
      <ScriptTextArea label="Script" script={script} />
      {audio_url && <AudioCard url={audio_url} />}
    </>
  );
};
