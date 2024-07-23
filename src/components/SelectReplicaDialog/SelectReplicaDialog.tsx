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
const LIMIT = 10;

const SelectReplicaDialog: FC<SelectReplicaDialogProps> = ({
  defaultValue = '',
  value = '',
  children,
  onChange,
}) => {
  const {
    data: stockReplicas,
    isLoading: stockReplicasIsLoading,
    fetchNextPage: fetchNextPageStock,
    hasNextPage: hasNextPageStock,
    isFetchingNextPage: isFetchingNextPageStock,
  } = useReplicasQuery({
    refetchInterval: false,
    queryParams: {
      limit: LIMIT,
      replica_type: ReplicaType.STUDIO,
    },
  });

  const {
    data: personalReplicas,
    isLoading: personalReplicasIsLoading,
    fetchNextPage: fetchNextPagePersonal,
    hasNextPage: hasNextPagePersonal,
    isFetchingNextPage: isFetchingNextPagePersonal,
  } = useReplicasQuery({
    queryParams: {
      limit: LIMIT,
      replica_type: ReplicaType.PERSONAL,
    },
  });
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

  const stockReplicasData = useMemo(() => {
    return stockReplicas?.pages?.map(page => page.data).flat();
  }, [stockReplicas]);

  const personalReplicasData = useMemo(() => {
    return personalReplicas?.pages
      ?.map(page => page.data)
      ?.flat()
      ?.filter(replica => replica.status === ReplicaStatus.COMPLETED);
  }, [personalReplicas]);

  const handleLoadMoreStock = () => {
    void fetchNextPageStock();
  };

  const handleLoadMorePersonal = () => {
    void fetchNextPagePersonal();
  };

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
                <TabsTrigger value="studio">Stock</TabsTrigger>
              </TabsList>
              <TabsContent value="all" tabIndex={-1}>
                <div className="space-y-8">
                  <SelectReplicaBlock
                    title="Personal Replicas"
                    replicas={personalReplicasData}
                    isLoading={personalReplicasIsLoading}
                    isPersonalReplicas
                    isMuted={isMuted}
                    toggleMute={toggleMute}
                    onMuteChange={onMuteChange}
                    onSelect={handleSelect}
                    selectedReplicaId={selectedReplicaId}
                    onLoadMore={
                      hasNextPagePersonal ? handleLoadMorePersonal : undefined
                    }
                    isFetchingNextPage={isFetchingNextPagePersonal}
                  />
                  <SelectReplicaBlock
                    title="Stock Replicas"
                    replicas={stockReplicasData}
                    isLoading={stockReplicasIsLoading}
                    isMuted={isMuted}
                    toggleMute={toggleMute}
                    onMuteChange={onMuteChange}
                    onSelect={handleSelect}
                    selectedReplicaId={selectedReplicaId}
                    onLoadMore={
                      hasNextPageStock ? handleLoadMoreStock : undefined
                    }
                    isFetchingNextPage={isFetchingNextPageStock}
                  />
                </div>
              </TabsContent>
              <TabsContent value="personal" tabIndex={-1}>
                <SelectReplicaBlock
                  title="Personal Replicas"
                  replicas={personalReplicasData}
                  isLoading={personalReplicasIsLoading}
                  isPersonalReplicas
                  isMuted={isMuted}
                  toggleMute={toggleMute}
                  onMuteChange={onMuteChange}
                  onSelect={handleSelect}
                  selectedReplicaId={selectedReplicaId}
                  onLoadMore={
                    hasNextPagePersonal ? handleLoadMorePersonal : undefined
                  }
                  isFetchingNextPage={isFetchingNextPagePersonal}
                />
              </TabsContent>
              <TabsContent value="studio" tabIndex={-1}>
                <SelectReplicaBlock
                  title="Stock Replicas"
                  replicas={stockReplicasData}
                  isLoading={stockReplicasIsLoading}
                  isMuted={isMuted}
                  toggleMute={toggleMute}
                  onMuteChange={onMuteChange}
                  onSelect={handleSelect}
                  selectedReplicaId={selectedReplicaId}
                  onLoadMore={
                    hasNextPageStock ? handleLoadMoreStock : undefined
                  }
                  isFetchingNextPage={isFetchingNextPageStock}
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
