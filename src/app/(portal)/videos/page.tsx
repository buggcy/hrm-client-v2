/* eslint-disable @next/next/no-img-element */
'use client';
import { useState } from 'react';

import { keepPreviousData } from '@tanstack/react-query';
import { MoveRight, Video } from 'lucide-react';

import { CopyApiUrl } from '@/components/CopyApiUrl';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useVideosQuery } from '@/hooks';

const LIMIT = 5;
// DUMMY CONTENT, GENERATED FOR TEST PURPOSES / DO NOT SPEND YOUR TIME FOR REVIEW
// WILL BE REMOVED
export default function VideosPage() {
  const [page, setPage] = useState(1);
  const { data: videos, isPending } = useVideosQuery({
    queryParams: { page, limit: LIMIT },
    placeholderData: keepPreviousData,
  });

  return (
    <Layout>
      <LayoutHeader title={'Video Library'}>
        <CopyApiUrl type="GET" url="/v2/videos" />
        <LayoutHeaderButtonsBlock>
          <Button className="ml-auto" variant="outline">
            Read Docs
          </Button>
          <Button>Create Video</Button>
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper>
        <Card>
          <CardHeader>
            <CardTitle>Videos</CardTitle>
            <CardDescription>Bla Bla Bla</CardDescription>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <div>Loader...</div>
            ) : (
              <>
                {videos ? (
                  <Table>
                    <TableHeader>
                      <tr>
                        <TableHead>
                          <span className="sr-only">Thumbnail</span>
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Request ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>
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
                          created_at,
                          data,
                        }) => (
                          <TableRow
                            key={video_id}
                            className="group hover:bg-inherit"
                            onClick={() => {
                              console.log('Clicked');
                            }}
                          >
                            <TableCell>
                              {still_image_thumbnail_url ? (
                                <img
                                  src={still_image_thumbnail_url}
                                  alt={video_name || 'Video thumbnail'}
                                  className="w-16 object-contain"
                                />
                              ) : (
                                <Video className="w-16" />
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="max-w-[25ch]">
                                <p className="truncate">{video_name}</p>
                                <p className="truncate">{data?.script}</p>
                              </div>
                            </TableCell>
                            <TableCell>{video_id}</TableCell>
                            <TableCell>{status}</TableCell>
                            <TableCell>
                              {created_at.toLocaleString('default', {
                                month: 'long',
                              })}{' '}
                              {created_at.getDate()},{' '}
                              {created_at.toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true,
                              })}
                            </TableCell>
                            <TableCell>
                              <MoveRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                            </TableCell>
                          </TableRow>
                        ),
                      )}
                    </TableBody>
                  </Table>
                ) : (
                  <div>Empty</div>
                )}
              </>
            )}
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Showing <strong>1-10</strong> of <strong>32</strong> videos
            </div>
            <div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage(prev => prev - 1)}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink>2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink>3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext onClick={() => setPage(prev => prev + 1)} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardFooter>
        </Card>
      </LayoutWrapper>
    </Layout>
  );
}
