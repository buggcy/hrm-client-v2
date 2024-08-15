'use client';
import { useMemo } from 'react';
import Link from 'next/link';

import { Loader } from 'lucide-react';

import { CopyApiUrl } from '@/components/CopyApiUrl';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { ReadDocsButton } from '@/components/ReadDocsButton';
import { useReplicasVideoMute } from '@/components/ReplicaCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useReplicasQuery } from '@/hooks';
import { useReplicaQueryParams } from '@/hooks/useReplicaQueryParams/useReplicaQueryParams';

import { ReplicaBlock } from './components/ReplicaBlock';

import { ReplicaStatus, ReplicaType } from '@/types';

const LIMIT = 10;

export default function ReplicasPage() {
  const { params } = useReplicaQueryParams();
  const {
    data: stockReplicas,
    isLoading: stockReplicasIsLoading,
    isRefetching: stockReplicasIsRefetching,
    isPlaceholderData: stockReplicasIsPlaceholderData,
    fetchNextPage: fetchNextPageStock,
    hasNextPage: hasNextPageStock,
    isFetchingNextPage: isFetchingNextPageStock,
  } = useReplicasQuery({
    refetchInterval: false,
    refetchOnWindowFocus: false,
    queryParams: {
      limit: LIMIT,
      replica_type: ReplicaType.STUDIO,
      ...params,
    },
  });

  const {
    data: personalReplicas,
    isLoading: personalReplicasIsLoading,
    isRefetching,
    isPlaceholderData,
    fetchNextPage: fetchNextPagePersonal,
    hasNextPage: hasNextPagePersonal,
    isFetchingNextPage: isFetchingNextPagePersonal,
  } = useReplicasQuery({
    refetchInterval(query) {
      if (
        query.state.data?.pages
          ?.map(page => page.data)
          ?.flat()
          ?.some(({ status }) => status === ReplicaStatus.STARTED)
      ) {
        return 30 * 1000;
      }
      // to keep the data up to date
      return 5 * 60 * 1000;
    },
    refetchOnWindowFocus: true,
    queryParams: {
      limit: LIMIT,
      replica_type: ReplicaType.PERSONAL,
    },
  });
  const { isMuted, toggleMute, onMuteChange } = useReplicasVideoMute();

  const handleLoadMoreStock = () => {
    void fetchNextPageStock();
  };

  const handleLoadMorePersonal = () => {
    void fetchNextPagePersonal();
  };

  const stockReplicasData = useMemo(() => {
    return stockReplicas?.pages?.map(page => page.data).flat();
  }, [stockReplicas]);

  const personalReplicasData = useMemo(() => {
    return personalReplicas?.pages?.map(page => page.data).flat();
  }, [personalReplicas]);

  const backgroundRefetching =
    (!isPlaceholderData && isRefetching && !personalReplicasIsLoading) ||
    (!stockReplicasIsPlaceholderData &&
      stockReplicasIsRefetching &&
      !stockReplicasIsLoading);

  return (
    <Layout>
      <LayoutHeader title={'Replica Library'}>
        <CopyApiUrl type="GET" url="replica" className="hidden sm:flex" />
        <LayoutHeaderButtonsBlock>
          <ReadDocsButton to="replicaLibrary" />
          <Button asChild>
            <Link href="/replicas/create">Create Replica</Link>
          </Button>
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper>
        <Tabs defaultValue="all" className="relative w-full">
          <TabsList className="mb-6 border">
            <TabsTrigger value="all">All Replicas</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="studio">Stock</TabsTrigger>
          </TabsList>
          {backgroundRefetching && (
            <div className="absolute right-2 top-2">
              <Loader className="size-6 animate-spin" />
            </div>
          )}
          <TabsContent value="all" tabIndex={-1}>
            <div className="space-y-10">
              <ReplicaBlock
                title="Personal Replicas"
                replicas={personalReplicasData}
                isLoading={stockReplicasIsLoading}
                isPersonalReplicas
                isMuted={isMuted}
                toggleMute={toggleMute}
                onMuteChange={onMuteChange}
                onLoadMore={
                  hasNextPagePersonal ? handleLoadMorePersonal : undefined
                }
                isFetchingNextPage={isFetchingNextPagePersonal}
              />
              <ReplicaBlock
                title="Stock Replicas"
                replicas={stockReplicasData}
                isLoading={stockReplicasIsLoading}
                isMuted={isMuted}
                toggleMute={toggleMute}
                onMuteChange={onMuteChange}
                onLoadMore={hasNextPageStock ? handleLoadMoreStock : undefined}
                isFetchingNextPage={isFetchingNextPageStock}
              />
            </div>
          </TabsContent>
          <TabsContent value="personal" tabIndex={-1}>
            <ReplicaBlock
              title="Personal Replicas"
              replicas={personalReplicasData}
              isLoading={stockReplicasIsLoading}
              isPersonalReplicas
              isMuted={isMuted}
              toggleMute={toggleMute}
              onMuteChange={onMuteChange}
              onLoadMore={
                hasNextPagePersonal ? handleLoadMorePersonal : undefined
              }
              isFetchingNextPage={isFetchingNextPagePersonal}
            />
          </TabsContent>
          <TabsContent value="studio" tabIndex={-1}>
            <ReplicaBlock
              title="Stock Replicas"
              replicas={stockReplicasData}
              isLoading={stockReplicasIsLoading}
              isMuted={isMuted}
              toggleMute={toggleMute}
              onMuteChange={onMuteChange}
              onLoadMore={hasNextPageStock ? handleLoadMoreStock : undefined}
              isFetchingNextPage={isFetchingNextPageStock}
            />
          </TabsContent>
        </Tabs>
      </LayoutWrapper>
    </Layout>
  );
}
