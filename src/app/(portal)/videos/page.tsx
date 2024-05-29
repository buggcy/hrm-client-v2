/* eslint-disable @next/next/no-img-element */
'use client';
import { useState } from 'react';
import Link from 'next/link';

import { keepPreviousData } from '@tanstack/react-query';
import { MoreHorizontal, Video } from 'lucide-react';

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
                  <TableRow>
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
                  </TableRow>
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
                      <TableRow key={video_id}>
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                              >
                                <MoreHorizontal className="size-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Button
                                  asChild
                                  variant="ghost"
                                  className="w-full"
                                >
                                  <Link href={`/videos/details?id=${video_id}`}>
                                    Details
                                  </Link>
                                </Button>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Button variant="ghost" className="w-full">
                                  Delete
                                </Button>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
                <PaginationPrevious onClick={() => setPage(prev => prev - 1)} />
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
  );
}
