'use client';
import { useSearchParams } from 'next/navigation';

import { Video } from 'lucide-react';

import { CopyApiUrl } from '@/components/CopyApiUrl';
import { Layout, LayoutHeader, LayoutWrapper } from '@/components/Layout';
import { ReadDocsButton } from '@/components/ReadDocsButton';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { useVideoQuery, useVideoQueryRefetchInterval } from '@/hooks';

import { ShareFooterButtons } from '../components/ShareFooterButtons';
import { VideoBlock } from '../components/VideoBlock';
import { VideoDataBlock } from '../components/VideoDataBlock';
import { VideoInfoBlock } from '../components/VideoInfoBlock';

export default function VideoDetailsPage() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('id');
  // TODO: add refetch if video in generating status
  const {
    data: video,
    isLoading,
    isError,
  } = useVideoQuery(videoId as string, {
    enabled: !!videoId,
    retry: 1,
    refetchInterval: useVideoQueryRefetchInterval,
  });

  return (
    <Layout>
      <LayoutHeader title={'Video Library'}>
        <CopyApiUrl type="GET" url="video" id={videoId as string} />
        <ReadDocsButton to="videoDetails" />
      </LayoutHeader>
      <LayoutWrapper>
        {isError && (
          <div className="my-20 flex flex-1 flex-col items-center justify-center gap-4">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary-foreground">
              <span>
                <Video className="size-4 text-primary" />
              </span>
            </div>
            <p className="font-medium">Video not found</p>
          </div>
        )}
        {!isError && (
          <div className="grid grid-cols-2 gap-6">
            <Card className="flex flex-col p-4">
              <CardContent className="mb-4 p-0">
                {/* TODO: add when video request will contain all necessary info to show code */}
                {/* <Tabs defaultValue="video">
                <TabsList>
                  <TabsTrigger value="video">Video</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                </TabsList>
                <TabsContent value="video">
                  <VideoBlock
                    status={video?.status}
                    stream_url={video?.stream_url}
                    className="h-78.5"
                  />
                </TabsContent>
                <TabsContent value="code">
                  <Code />
                </TabsContent>
              </Tabs> */}
                {isLoading ? (
                  <div className="overflow-hidden rounded-md">
                    <Skeleton className="aspect-video" />
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-md">
                    <VideoBlock
                      status={video?.status}
                      stream_url={video?.stream_url}
                      className="h-78.5"
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter className="mt-auto p-0">
                <ShareFooterButtons
                  status={video?.status}
                  downloadUrl={video?.download_url}
                  hostedUrl={video?.hosted_url}
                />
              </CardFooter>
            </Card>
            <Card>
              <CardContent className="flex flex-col gap-6 p-4">
                {isLoading ? (
                  <div className="flex flex-col gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                ) : (
                  <>
                    <VideoInfoBlock
                      video_name={video?.video_name}
                      video_id={video?.video_id}
                      created_at={video?.created_at}
                      status={video?.status}
                      withDelete
                    />
                    <VideoDataBlock data={video?.data} />
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </LayoutWrapper>
    </Layout>
  );
}
