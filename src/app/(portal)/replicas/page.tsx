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
import { useReplicasVideoMute } from '@/components/ReplicaCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useReplicasQuery } from '@/hooks';

import { ReplicaBlock } from './components/ReplicaBlock';

import { ReplicaStatus, ReplicaType } from '@/types';

export default function ReplicasPage() {
  const {
    data: replicas,
    isLoading,
    isRefetching,
    isPlaceholderData,
  } = useReplicasQuery({
    refetchInterval(query) {
      if (
        query.state.data?.data?.some(
          ({ status }) => status === ReplicaStatus.STARTED,
        )
      ) {
        return 30 * 1000;
      }
      // to keep the data up to date
      return 5 * 60 * 1000;
    },
    refetchOnWindowFocus: true,
  });
  const { isMuted, toggleMute, onMuteChange } = useReplicasVideoMute();

  const studioReplicas = useMemo(() => {
    return replicas?.data?.filter(
      replica =>
        replica.replica_type === ReplicaType.STUDIO &&
        replica.status === ReplicaStatus.COMPLETED,
    );
  }, [replicas?.data]);

  const personalReplicas = useMemo(() => {
    return replicas?.data?.filter(
      replica => replica.replica_type === ReplicaType.PERSONAL,
    );
  }, [replicas?.data]);

  const initialLoading = isLoading;
  const backgroundRefetching = !isPlaceholderData && isRefetching && !isLoading;

  return (
    <Layout>
      <LayoutHeader title={'Replica Library'}>
        <CopyApiUrl type="GET" url="replica" />
        <LayoutHeaderButtonsBlock>
          <Button className="ml-auto" variant="outline">
            Read Docs
          </Button>
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
            <TabsTrigger value="studio">Studio</TabsTrigger>
          </TabsList>
          {backgroundRefetching && (
            <div className="absolute right-2 top-2">
              <Loader className="size-6 animate-spin" />
            </div>
          )}
          <TabsContent value="all">
            <div className="space-y-10">
              <ReplicaBlock
                title="Personal Replicas"
                replicas={personalReplicas}
                isLoading={initialLoading}
                isPersonalReplicas
                isMuted={isMuted}
                toggleMute={toggleMute}
                onMuteChange={onMuteChange}
              />
              <ReplicaBlock
                title="Studio Replicas"
                replicas={studioReplicas}
                isLoading={initialLoading}
                isMuted={isMuted}
                toggleMute={toggleMute}
                onMuteChange={onMuteChange}
              />
            </div>
          </TabsContent>
          <TabsContent value="personal">
            <ReplicaBlock
              title="Personal Replicas"
              replicas={personalReplicas}
              isLoading={initialLoading}
              isPersonalReplicas
              isMuted={isMuted}
              toggleMute={toggleMute}
              onMuteChange={onMuteChange}
            />
          </TabsContent>
          <TabsContent value="studio">
            <ReplicaBlock
              title="Studio Replicas"
              replicas={studioReplicas}
              isLoading={initialLoading}
              isMuted={isMuted}
              toggleMute={toggleMute}
              onMuteChange={onMuteChange}
            />
          </TabsContent>
        </Tabs>
      </LayoutWrapper>
    </Layout>
  );
}
