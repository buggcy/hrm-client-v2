import { format } from 'date-fns';

import { ScriptTextArea } from '@/components/ScriptTextArea';

import { useReplicaQuery } from '@/hooks';
import { createReplicaThumbnailUrl } from '@/utils';

import { IPersona } from '@/types';

const Item = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center gap-4">
    <div className="w-full max-w-38.5">
      <p className="text-sm font-semibold">{label}</p>
    </div>
    <div className="w-full">
      <p className="text-sm font-medium">{children}</p>
    </div>
  </div>
);

export const PersonaDetails = ({
  selectedPersona,
}: {
  selectedPersona?: IPersona;
}) => {
  const { data: replica } = useReplicaQuery(
    selectedPersona?.default_replica_id as string,
    {
      enabled: !!selectedPersona?.default_replica_id,
    },
  );

  return (
    <div className="no-scrollbar hidden flex-col overflow-x-hidden overflow-y-scroll border-l p-6 pr-12 md:flex md:w-1/2">
      {replica?.thumbnail_video_url && (
        <video
          className="mb-4 aspect-video w-full rounded-md bg-black"
          muted
          preload="metadata"
          controls={false}
          key={replica.thumbnail_video_url}
        >
          <source
            src={createReplicaThumbnailUrl(replica?.thumbnail_video_url)}
            type="video/mp4"
          />
        </video>
      )}
      <div>
        <h3 className="w-full truncate text-lg font-semibold">
          {selectedPersona?.persona_name}
        </h3>
      </div>
      <div className="my-4 space-y-3">
        <Item label="Persona ID">{selectedPersona?.persona_id}</Item>
        <Item label="Replica ID">{selectedPersona?.default_replica_id}</Item>
        {selectedPersona?.created_at && (
          <Item label="Created">
            {selectedPersona?.created_at &&
              format(selectedPersona.created_at, 'MMMM d, h:mm aaa')}
          </Item>
        )}
      </div>
      <ScriptTextArea
        label="System Prompt"
        script={selectedPersona?.system_prompt}
        className="mb-4"
      />
      <ScriptTextArea
        label="Persona Context"
        script={selectedPersona?.context}
        className="mb-4"
      />
    </div>
  );
};
