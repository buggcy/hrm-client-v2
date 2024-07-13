'use client';
import { useSearchParams } from 'next/navigation';

import { CopyApiUrl } from '@/components/CopyApiUrl';
import { Layout, LayoutHeader, LayoutWrapper } from '@/components/Layout';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useVideoQuery } from '@/hooks';

import { ShareFooterButtons } from '../components/ShareFooterButtons';
import { VideoBlock } from '../components/VideoBlock';
import { VideoDataBlock } from '../components/VideoDataBlock';
import { VideoInfoBlock } from '../components/VideoInfoBlock';

export default function VideoDetailsPage() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('id');
  //TODO: add logic to show input if no videoId instead of redirecting
  // TODO: add refetch if video in generating status
  const { data: video } = useVideoQuery(videoId as string, {
    enabled: !!videoId,
  });

  return (
    <Layout>
      <LayoutHeader title={'Video Library'}>
        <CopyApiUrl type="GET" url="video" id={videoId as string} />
      </LayoutHeader>
      <LayoutWrapper>
        <div className="grid grid-cols-2 gap-6">
          <Card className="flex flex-col p-4">
            <CardContent className="mb-4 p-0">
              <Tabs defaultValue="video">
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
                <TabsContent value="code">TBD</TabsContent>
              </Tabs>
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
              <VideoInfoBlock
                video_name={video?.video_name}
                video_id={video?.video_id}
                created_at={video?.created_at}
                status={video?.status}
                withDelete
              />
              <VideoDataBlock data={video?.data} />
            </CardContent>
          </Card>
        </div>
      </LayoutWrapper>
    </Layout>
  );
}
