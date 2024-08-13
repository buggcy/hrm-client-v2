'use client';

import { ChevronDown, Loader } from 'lucide-react';

import { SelectReplicaDialog } from '@/components/SelectReplicaDialog';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { useReplicaQuery } from '@/hooks';
import { createReplicaThumbnailUrl } from '@/utils';

import { DEFAULT_REPLICA } from '../videos/create/constants';

import { IReplica } from '@/types';

export const ReplicaSelect = ({
  value,
  onChange,
}: {
  value: IReplica['replica_id'];
  onChange: (value: IReplica['replica_id']) => void;
}) => {
  const { data: selectedReplica } = useReplicaQuery(value, {
    placeholderData:
      value === DEFAULT_REPLICA.replica_id ? DEFAULT_REPLICA : undefined,
  });

  return (
    <div className="flex w-full flex-col">
      <Label className="mb-2 inline-block">Replica</Label>
      <SelectReplicaDialog value={value} onChange={onChange}>
        <Button
          variant="ghost"
          type="button"
          className="group h-auto w-full items-center rounded-md border border-border bg-background px-3 py-2 hover:border-primary hover:bg-background"
        >
          <Avatar className="mr-2 flex size-8 items-center justify-center overflow-hidden text-center">
            <video
              src={createReplicaThumbnailUrl(
                selectedReplica?.thumbnail_video_url,
              )}
              className="absolute z-20 aspect-square size-full object-cover"
              crossOrigin="anonymous"
            />
            <Loader className="absolute z-10 size-5 animate-spin" />
          </Avatar>
          <p className="mr-1 text-sm font-medium">
            <span>{selectedReplica?.replica_name || 'Loading...'}</span>
            {value === DEFAULT_REPLICA.replica_id && (
              <span className="ml-1 text-muted-foreground">(default)</span>
            )}
          </p>
          <ChevronDown
            className="ml-auto text-muted-foreground group-hover:text-primary"
            size={16}
          />
        </Button>
      </SelectReplicaDialog>
    </div>
  );
};
