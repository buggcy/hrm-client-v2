import { useState } from 'react';

import { ChevronDown } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import { isProd } from '@/constants';

import { IReplica, ReplicaStatus } from '@/types';

export const DEFAULT_REPLICA: IReplica = {
  // TODO: replace with actual data
  replica_id: isProd ? '1' : 'r2a0fd8fc8',
  replica_name: 'Bailey',
  status: ReplicaStatus.COMPLETED,
  created_at: new Date(),
  updated_at: new Date(),
  training_progress: '100',
  thumbnail_video_url: '',
};

export const ReplicaSelect = () => {
  const [selectedReplica] = useState<IReplica>(DEFAULT_REPLICA);

  return (
    <div className="flex w-full flex-col">
      <p className="mb-1.5 text-sm font-semibold">Replica</p>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            type="button"
            className="group h-auto w-full items-center rounded-md border border-border bg-background px-3 py-2 hover:border-primary hover:bg-background"
          >
            <Avatar className="mr-2 size-8">
              <AvatarImage src="https://github.com/shadc/n.png" />
              <AvatarFallback>R</AvatarFallback>
            </Avatar>
            <p className="mr-1 text-sm font-medium">
              <span className="group-hover:text-primary">
                {selectedReplica.replica_name}
              </span>
              {selectedReplica === DEFAULT_REPLICA && (
                <span className="ml-1 text-muted-foreground group-hover:text-primary">
                  (default)
                </span>
              )}
            </p>
            <ChevronDown
              className="ml-auto text-muted-foreground group-hover:text-primary"
              size={16}
            />
          </Button>
        </DialogTrigger>
        <DialogContent></DialogContent>
      </Dialog>
    </div>
  );
};
