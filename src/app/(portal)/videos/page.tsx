/* eslint-disable @next/next/no-img-element */
'use client';
import { useState } from 'react';
import Link from 'next/link';

import { keepPreviousData } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ArrowRight, Loader, LoaderCircle, Video } from 'lucide-react';

import { CopyApiUrl } from '@/components/CopyApiUrl';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Pagination } from '@/components/Pagination';
import { ReadDocsButton } from '@/components/ReadDocsButton';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  useVideoDetailsSheet,
  VideoDetailsSheet,
} from '@/app/(portal)/videos/components/VideoDetailsSheet';
import { useVideosQuery, useVideosQueryRefetchInterval } from '@/hooks';

import { CopyRequestID } from './components/CopyRequestID/CopyRequestID';
import { GetVideoByIdInput } from './components/GetVideoByIdInput';
import { Thumbnail } from './components/Thumbnail';

import { VideoStatus } from '@/types';

const LIMIT = 10;

export default function VideosPage() {
  const { video_id, onOpenChange } = useVideoDetailsSheet();
  const [page, setPage] = useState(1);

  const {
    data: videos,
    isLoading,
    isRefetching,
    isPlaceholderData,
  } = useVideosQuery({
    queryParams: {
      page: page - 1,
      limit: LIMIT,
      filter_out_status: VideoStatus.DELETED,
    },
    placeholderData: keepPreviousData,
    refetchInterval: useVideosQueryRefetchInterval,
    refetchOnWindowFocus: true,
  });

  const initialLoading = isLoading;
  const backgroundRefetching = !isPlaceholderData && isRefetching && !isLoading;
  const manualRefetching = isPlaceholderData && isRefetching && !isLoading;

  return (
    <Layout>
      <LayoutHeader title={'Video Library'}>
        <CopyApiUrl type="GET" url="video" className="hidden sm:flex" />
        <LayoutHeaderButtonsBlock>
          <ReadDocsButton to="videoLibrary" />
          <Button asChild>
            <Link href="/videos/create">Create Video</Link>
          </Button>
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper>
        <VideoDetailsSheet id={video_id} onOpenChange={onOpenChange} />

        <Card>
          <CardHeader>
            <CardTitle>My Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <GetVideoByIdInput />
            <div className="relative">
              {manualRefetching && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted opacity-50">
                  <LoaderCircle className="size-10 animate-spin" />
                </div>
              )}
              {initialLoading && (
                <div className="z-10 mt-2.5 space-y-2">
                  <Skeleton className="h-8 w-full rounded-md" />
                  <Skeleton className="h-16 w-full rounded-md" />
                  <Skeleton className="h-16 w-full rounded-md" />
                  <Skeleton className="h-16 w-full rounded-md" />
                </div>
              )}
              {backgroundRefetching && (
                <div className="absolute right-5 top-3">
                  <Loader className="size-6 animate-spin" />
                </div>
              )}
              {!!videos?.data?.length && (
                <Table>
                  <TableHeader className="[&_tr]:border-none">
                    <tr>
                      <TableHead>
                        <span className="sr-only">Thumbnail</span>
                      </TableHead>
                      <TableHead className="text-left">Name</TableHead>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden lg:table-cell">
                        Date
                      </TableHead>
                      <TableHead className="text-right">
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </tr>
                  </TableHeader>
                  <TableBody>
                    {videos.data.map(
                      ({
                        video_id,
                        video_name,
                        status,
                        still_image_thumbnail_url,
                        generation_progress,
                        created_at,
                        data,
                      }) => (
                        <TableRow
                          tabIndex={0}
                          onKeyDown={e => {
                            // @ts-expect-error tagName is in the type
                            if (e.target.tagName === 'TR') {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onOpenChange(video_id);
                              }
                            }
                          }}
                          key={video_id}
                          className="group cursor-pointer rounded-lg border-none outline-offset-[-1px] outline-border hover:bg-transparent hover:outline"
                          onClick={() => onOpenChange(video_id)}
                        >
                          <TableCell className="p-2">
                            <div className="flex h-13.5 w-24 items-center justify-center overflow-hidden rounded border bg-secondary">
                              <Thumbnail
                                src={still_image_thumbnail_url}
                                status={status}
                                progress={generation_progress}
                                video_name={video_name}
                              />
                            </div>
                          </TableCell>
                          <TableCell className="p-2 text-left">
                            <div className="max-w-[25ch] md:max-w-[35ch] lg:max-w-[40ch] xl:max-w-[60ch] 2xl:max-w-[80ch]">
                              <p className="mt-1 truncate font-semibold">
                                {video_name}
                              </p>
                              {data?.script && (
                                <p className="truncate font-medium text-muted-foreground">
                                  {data.script}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="p-2">
                            <CopyRequestID id={video_id} />
                          </TableCell>
                          <TableCell className="p-2">
                            <StatusBadge status={status} />
                          </TableCell>
                          <TableCell className="hidden p-2 font-medium lg:table-cell">
                            {created_at &&
                              format(created_at, 'MMMM d, h:mm aaa')}
                          </TableCell>
                          <TableCell className="p-2">
                            <ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                          </TableCell>
                        </TableRow>
                      ),
                    )}
                  </TableBody>
                </Table>
              )}
              {videos?.data?.length === 0 && (
                <div className="my-20 flex flex-1 flex-col items-center justify-center gap-4">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary-foreground">
                    <span>
                      <Video className="size-4 text-primary" />
                    </span>
                  </div>
                  <p className="font-medium">
                    Create your first video with your own replica or using stock
                    replicas!
                  </p>
                  <Button variant="link" asChild>
                    <Link href="/videos/create">
                      Create your first video <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
          {!!videos?.total_count && (
            <CardFooter className="flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
              <div className="text-xs text-muted-foreground">
                Showing{' '}
                <strong>
                  {(page - 1) * LIMIT + 1} -{' '}
                  {Math.min(videos.total_count, (page - 1) * LIMIT + LIMIT)}
                </strong>{' '}
                of <strong>{videos.total_count}</strong> videos
              </div>
              <div>
                <Pagination
                  total={videos?.total_count || 0}
                  currentPage={page}
                  perPage={LIMIT}
                  onPageChange={setPage}
                />
              </div>
            </CardFooter>
          )}
        </Card>
      </LayoutWrapper>
    </Layout>
  );
}
