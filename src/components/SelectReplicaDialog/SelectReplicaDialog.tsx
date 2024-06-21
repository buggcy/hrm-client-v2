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
  children,
  defaultReplica,
  onSubmit,
}) => {
  const { data: replicas, isLoading } = useReplicasQuery();
  const [open, setOpen] = useState(false);
  const [selectedReplica, setSelectedReplica] = useState<IReplica | null>(
    defaultReplica ?? null,
  );

  useEffect(() => {
    if (defaultReplica && open) {
      setSelectedReplica(defaultReplica);
    }
  }, [defaultReplica, open]);

  const { isMuted, toggleMute, onMuteChange } = useReplicasVideoMute();
  const handleOpen = () => setOpen(true);

  const handleSelect = (replica: IReplica) => {
    setSelectedReplica(replica);
  };

  const handleSubmit = () => {
    if (!selectedReplica) return;
    onSubmit(selectedReplica);
    selectedReplica && setSelectedReplica(null);
    setOpen(false);
  };

  const studioReplicas = useMemo(() => {
    return (
      replicas?.data?.filter(
        replica =>
          replica.replica_type === ReplicaType.STUDIO &&
          replica.status === ReplicaStatus.COMPLETED,
      ) ?? []
    );
  }, [replicas?.data]);

  const personalReplicas = useMemo(() => {
    return (
      replicas?.data?.filter(
        replica =>
          replica.replica_type === ReplicaType.PERSONAL &&
          replica.status === ReplicaStatus.COMPLETED,
      ) ?? []
    );
  }, [replicas?.data]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedReplica(null);
    }
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild onClick={handleOpen}>
        {children}
      </DialogTrigger>
      <DialogContent className="flex size-full max-h-[80vh] max-w-screen-lg flex-col overflow-auto pb-0">
        <DialogHeader className="border-b pb-4">
          <h3 className="text-xl font-semibold">Pick a Replica</h3>
        </DialogHeader>
        <div className="relative">
          <Tabs defaultValue="all" className="size-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Replicas</TabsTrigger>
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="studio">Studio</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
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
                  selectedReplica={selectedReplica}
                />
                <SelectReplicaBlock
                  title="Studio Replicas"
                  replicas={studioReplicas}
                  isLoading={isLoading}
                  isMuted={isMuted}
                  toggleMute={toggleMute}
                  onMuteChange={onMuteChange}
                  onSelect={handleSelect}
                  selectedReplica={selectedReplica}
                />
              </div>
            </TabsContent>
            <TabsContent value="personal">
              <SelectReplicaBlock
                title="Personal Replicas"
                replicas={personalReplicas}
                isLoading={isLoading}
                isPersonalReplicas
                isMuted={isMuted}
                toggleMute={toggleMute}
                onMuteChange={onMuteChange}
                onSelect={handleSelect}
                selectedReplica={selectedReplica}
              />
            </TabsContent>
            <TabsContent value="studio">
              <SelectReplicaBlock
                title="Studio Replicas"
                replicas={studioReplicas}
                isLoading={isLoading}
                isMuted={isMuted}
                toggleMute={toggleMute}
                onMuteChange={onMuteChange}
                onSelect={handleSelect}
                selectedReplica={selectedReplica}
              />
            </TabsContent>
          </Tabs>

          <DialogFooter className="sticky bottom-0 -ml-6 mt-auto w-[calc(100%+3rem)] justify-end border-t bg-background py-3 pr-6">
            <Button onClick={handleSubmit}>Select</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { SelectReplicaDialog };
