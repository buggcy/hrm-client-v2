import { FC, useEffect, useMemo, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useReplicasQuery } from '@/hooks';

import { SelectReplicaBlock } from './components/SelectReplicaBlock';
import { SelectReplicaDialogProps } from './types';
import { useReplicasVideoMute } from '../ReplicaCard';
import { Button } from '../ui/button';

import { IReplica, ReplicaStatus, ReplicaType } from '@/types';

const SelectReplicaDialog: FC<SelectReplicaDialogProps> = ({
  defaultValue = '',
  value = '',
  children,
  onChange,
}) => {
  const { data: replicas, isLoading } = useReplicasQuery();
  const { isMuted, toggleMute, onMuteChange } = useReplicasVideoMute();
  const [open, setOpen] = useState(false);
  const [selectedReplicaId, setSelectedReplicaId] = useState<
    IReplica['replica_id']
  >(defaultValue || value);

  useEffect(() => {
    if (value) setSelectedReplicaId(value);
  }, [value]);

  const handleOpen = () => setOpen(true);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open && selectedReplicaId !== value) setSelectedReplicaId(value);
  };

  const handleSelect = (replica: IReplica) => {
    setSelectedReplicaId(replica?.replica_id);
  };

  const handleSubmit = () => {
    if (selectedReplicaId !== value) onChange(selectedReplicaId);
    setOpen(false);
  };

  const studioReplicas = useMemo(
    () =>
      replicas?.data?.filter(
        replica =>
          replica.replica_type === ReplicaType.STUDIO &&
          replica.status === ReplicaStatus.COMPLETED,
      ) ?? [],
    [replicas?.data],
  );

  const personalReplicas = useMemo(
    () =>
      replicas?.data?.filter(
        replica =>
          replica.replica_type === ReplicaType.PERSONAL &&
          replica.status === ReplicaStatus.COMPLETED,
      ) ?? [],
    [replicas?.data],
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild onClick={handleOpen}>
        {children}
      </DialogTrigger>
      <DialogContent className="h-[80vh] max-w-screen-lg p-0">
        <div className="relative inset-0 overflow-hidden">
          <div className="flex size-full flex-col gap-6 overflow-auto p-6 pb-20">
            <DialogHeader className="border-b pb-4">
              <h3 className="text-xl font-semibold">Pick a Replica</h3>
            </DialogHeader>
            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Replicas</TabsTrigger>
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="studio">Studio</TabsTrigger>
              </TabsList>
              <TabsContent value="all" tabIndex={-1}>
                <div className="space-y-8">
                  <SelectReplicaBlock
                    title="Personal Replicas"
                    replicas={personalReplicas}
                    isLoading={isLoading}
                    isPersonalReplicas
                    isMuted={isMuted}
                    toggleMute={toggleMute}
                    onMuteChange={onMuteChange}
                    onSelect={handleSelect}
                    selectedReplicaId={selectedReplicaId}
                  />
                  <SelectReplicaBlock
                    title="Studio Replicas"
                    replicas={studioReplicas}
                    isLoading={isLoading}
                    isMuted={isMuted}
                    toggleMute={toggleMute}
                    onMuteChange={onMuteChange}
                    onSelect={handleSelect}
                    selectedReplicaId={selectedReplicaId}
                  />
                </div>
              </TabsContent>
              <TabsContent value="personal" tabIndex={-1}>
                <SelectReplicaBlock
                  title="Personal Replicas"
                  replicas={personalReplicas}
                  isLoading={isLoading}
                  isPersonalReplicas
                  isMuted={isMuted}
                  toggleMute={toggleMute}
                  onMuteChange={onMuteChange}
                  onSelect={handleSelect}
                  selectedReplicaId={selectedReplicaId}
                />
              </TabsContent>
              <TabsContent value="studio" tabIndex={-1}>
                <SelectReplicaBlock
                  title="Studio Replicas"
                  replicas={studioReplicas}
                  isLoading={isLoading}
                  isMuted={isMuted}
                  toggleMute={toggleMute}
                  onMuteChange={onMuteChange}
                  onSelect={handleSelect}
                  selectedReplicaId={selectedReplicaId}
                />
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter className="sticky bottom-0 justify-end border-t bg-background py-3 pr-6">
            <Button onClick={handleSubmit}>Select</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { SelectReplicaDialog };
