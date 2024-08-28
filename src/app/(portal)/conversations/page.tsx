/* eslint-disable @next/next/no-img-element */
'use client';
import { useState } from 'react';
import Link from 'next/link';

import { keepPreviousData } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ArrowRight, Loader, LoaderCircle, MessageCircle } from 'lucide-react';

import { CopyApiUrl } from '@/components/CopyApiUrl';
import { CopyRequestID } from '@/components/CopyRequestID';
import { HighTrafficBanner } from '@/components/HighTrafficBanner';
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

import { useConversationsQuery } from '@/hooks/useConversations';

import {
  ConversationDetailsSheet,
  useConversationDetailsSheet,
} from './components/ConversationDetailsSheet';
import { GetConversationByIdInput } from './components/GetConversationByIdInput';

const LIMIT = 10;

export default function ConversationsPage() {
  const { conversationId, onOpenChange } = useConversationDetailsSheet();
  const [page, setPage] = useState(1);

  const {
    data: conversations,
    isLoading,
    isRefetching,
    isPlaceholderData,
  } = useConversationsQuery({
    queryParams: {
      page: page,
      limit: LIMIT,
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: true,
  });

  const initialLoading = isLoading;
  const backgroundRefetching = !isPlaceholderData && isRefetching && !isLoading;
  const manualRefetching = isPlaceholderData && isRefetching && !isLoading;

  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Conversation Library">
        <CopyApiUrl type="GET" url="conversation" className="hidden sm:flex" />
        <LayoutHeaderButtonsBlock>
          <ReadDocsButton to="conversationLibrary" />
          <Button asChild>
            <Link href="/conversations/create">Create Conversation</Link>
          </Button>
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper>
        <ConversationDetailsSheet
          id={conversationId}
          onOpenChange={onOpenChange}
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">My Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <GetConversationByIdInput />
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
              {!!conversations?.data?.length && (
                <Table>
                  <TableHeader className="[&_tr]:border-none">
                    <tr>
                      {/* <TableHead className="hidden lg:table-cell">
                        <span className="sr-only">Thumbnail</span>
                      </TableHead> */}
                      <TableHead className="text-left">Name</TableHead>
                      <TableHead>Persona ID</TableHead>
                      <TableHead>Conversation ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </tr>
                  </TableHeader>
                  <TableBody>
                    {conversations.data.map(
                      ({
                        conversation_name,
                        persona_id,
                        conversation_id,
                        status,
                        created_at,
                      }) => (
                        <TableRow
                          tabIndex={0}
                          onKeyDown={e => {
                            // @ts-expect-error tagName is in the type
                            if (e.target.tagName === 'TR') {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onOpenChange(conversation_id);
                              }
                            }
                          }}
                          key={conversation_id}
                          className="group cursor-pointer rounded-lg border-none outline-offset-[-1px] outline-border hover:bg-transparent hover:outline"
                          onClick={() => onOpenChange(conversation_id)}
                        >
                          <TableCell className="px-4 py-2 text-left">
                            <div className="max-w-[25ch] md:max-w-[40ch] lg:max-w-[35ch] xl:max-w-[60ch] 2xl:max-w-[80ch]">
                              <p className="mt-1 truncate font-semibold">
                                {conversation_name}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-2">
                            {persona_id && <CopyRequestID id={persona_id} />}
                          </TableCell>
                          <TableCell className="px-4 py-2">
                            <CopyRequestID id={conversation_id} />
                          </TableCell>
                          <TableCell className="px-4 py-2">
                            <StatusBadge status={status} />
                          </TableCell>
                          <TableCell className="px-4 py-2 font-medium">
                            {created_at &&
                              format(created_at, 'MMMM d, h:mm aaa')}
                          </TableCell>
                          <TableCell className="px-4 py-2">
                            <ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                          </TableCell>
                        </TableRow>
                      ),
                    )}
                  </TableBody>
                </Table>
              )}
              {conversations?.data?.length === 0 && (
                <div className="my-20 flex flex-1 flex-col items-center justify-center gap-4">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary-foreground">
                    <span>
                      <MessageCircle className="size-4 text-primary" />
                    </span>
                  </div>
                  <p className="font-medium">Create your first conversation!</p>
                  <Button variant="link" asChild>
                    <Link href="/conversations/create">
                      Create your first conversation
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
          {!!conversations?.total_count && (
            <CardFooter className="flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
              <div className="text-xs text-muted-foreground">
                Showing{' '}
                <strong>
                  {(page - 1) * LIMIT + 1} -{' '}
                  {Math.min(
                    conversations.total_count,
                    (page - 1) * LIMIT + LIMIT,
                  )}
                </strong>{' '}
                of <strong>{conversations.total_count}</strong> conversations
              </div>
              <div>
                <Pagination
                  total={conversations?.total_count || 0}
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
