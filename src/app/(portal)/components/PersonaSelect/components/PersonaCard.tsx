import { Avatar } from '@/components/ui/avatar';

import { useReplicaQuery } from '@/hooks';
import { cn, createReplicaThumbnailUrl } from '@/utils';

import { IPersona } from '@/types';

export const PersonaCard = ({
  persona,
  isSelected,
  onClick,
}: {
  isDefault?: boolean;
  persona: IPersona;
  isSelected: boolean;
  onClick: (id?: IPersona['persona_id']) => void;
}) => {
  const { data: replica } = useReplicaQuery(
    persona.default_replica_id as string,
    {
      enabled: !!persona.default_replica_id,
    },
  );

  return (
    <div
      className={cn('flex cursor-pointer space-x-4 rounded-lg border p-4', {
        'border-primary': isSelected,
      })}
      onClick={() => onClick(persona.persona_id)}
    >
      <Avatar className="size-8">
        <video
          className="aspect-video size-full rounded-md bg-black object-cover"
          muted
          crossOrigin="anonymous"
        >
          <source
            src={createReplicaThumbnailUrl(replica?.thumbnail_video_url)}
            type="video/mp4"
          />
        </video>
      </Avatar>
      <div className="w-full overflow-hidden">
        <h3 className="truncate font-semibold">{persona.persona_name}</h3>
        <p className="mt-1 w-full truncate text-sm text-muted-foreground">
          {persona.system_prompt}
        </p>
      </div>
    </div>
  );
};
