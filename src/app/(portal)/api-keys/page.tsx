/* eslint-disable @next/next/no-img-element */
'use client';
import { useState } from 'react';

import { keepPreviousData } from '@tanstack/react-query';
import { Loader, LoaderCircle, PlusIcon, Trash2Icon } from 'lucide-react';

import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Pagination } from '@/components/Pagination';
import { ReadDocsButton } from '@/components/ReadDocsButton';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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

import { useApiKeysQuery } from '@/hooks/useApiKeys';
import { formatDateToDayMonthYear } from '@/utils';

import { CreateApiKeyDialog } from './components/CreateApiKeyDialog/CreateApiKeyDialog';
import { DeleteApiKeyDialog } from './components/DeleteApiKeyDialog';

import { IApiKey } from '@/types';

const LIMIT = 10;

export default function ApiKeysPage() {
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<IApiKey['key_prefix'] | null>(null);
  const {
    data: apiKeys,
    isLoading,
    isRefetching,
    isPlaceholderData,
  } = useApiKeysQuery({
    queryParams: { page, limit: LIMIT },
    placeholderData: keepPreviousData,
  });

  const handleCreateOpen = () => setOpen(true);

  const handleDeleteOpen = (id: IApiKey['key_prefix'] | null) => {
    setDeleteId(id);
  };

  const handleDeleteClose = () => {
    setDeleteId(null);
  };

  const initialLoading = isLoading;
  const backgroundRefetching = !isPlaceholderData && isRefetching && !isLoading;
  const manualRefetching = isPlaceholderData && isRefetching && !isLoading;

  return (
    <Layout>
      <LayoutHeader title="API Keys">
        <LayoutHeaderButtonsBlock>
          <ReadDocsButton to="apiReference" />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper>
        <CreateApiKeyDialog open={open} onOpenChange={setOpen} />
        <DeleteApiKeyDialog id={deleteId} onClose={handleDeleteClose} />
        <Card>
          <CardHeader>
            <div className="flex flex-wrap gap-2 sm:flex-nowrap">
              <div>
                <CardTitle className="mb-2">
                  Create and manage API Keys
                </CardTitle>
                <CardDescription className="max-w-[50ch]">
                  Remember to save your API Keys in a safe spot. For security
                  purposes, secrets are not recoverable.
                </CardDescription>
              </div>
              <Button onClick={handleCreateOpen} className="ml-auto">
                Create New Key
              </Button>
            </div>
          </CardHeader>
          <CardContent className="relative flex">
            {manualRefetching && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted opacity-50">
                <LoaderCircle className="size-10 animate-spin" />
              </div>
            )}
            {initialLoading && (
              <div className="z-10 mt-2.5 size-full space-y-3">
                <Skeleton className="h-8 w-full rounded-md" />
                <Skeleton className="h-14 w-full rounded-md" />
                <Skeleton className="h-14 w-full rounded-md" />
              </div>
            )}
            {backgroundRefetching && (
              <div className="absolute right-5 top-3">
                <Loader className="size-6 animate-spin" />
              </div>
            )}
            {!!apiKeys?.rows?.length && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key Name</TableHead>
                    <TableHead>Key Prefix</TableHead>
                    <TableHead>Whitelisted IPs</TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Created
                    </TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys?.rows?.map(
                    ({ name, key_prefix, whitelisted_ips, created_at }) => (
                      <TableRow key={key_prefix}>
                        <TableCell>{name}</TableCell>
                        <TableCell>{key_prefix}</TableCell>
                        <TableCell>{whitelisted_ips}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {formatDateToDayMonthYear(created_at)}
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleDeleteOpen(key_prefix)}
                            variant="ghost"
                            size="icon"
                            className="size-8"
                          >
                            <Trash2Icon className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            )}
            {apiKeys?.rows?.length === 0 && (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary-foreground">
                  <PlusIcon className="size-4 text-primary" />
                </div>
                <p className="max-w-[28ch] text-center font-medium">
                  Create your first API Key to access the Tavus API.
                </p>
                <Button onClick={handleCreateOpen}>Create API Key</Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
            {!!apiKeys?.rows?.length && (
              <>
                <div className="text-xs text-muted-foreground">
                  {!!apiKeys?.count && (
                    <>
                      Showing{' '}
                      <strong>
                        {(page - 1) * LIMIT + 1} -{' '}
                        {Math.min(apiKeys.count, (page - 1) * LIMIT + LIMIT)}
                      </strong>{' '}
                      of <strong>{apiKeys.count}</strong> keys
                    </>
                  )}
                </div>
                <div>
                  <Pagination
                    total={apiKeys?.count || 0}
                    currentPage={page}
                    perPage={LIMIT}
                    onPageChange={setPage}
                  />
                </div>
              </>
            )}
          </CardFooter>
        </Card>
      </LayoutWrapper>
    </Layout>
  );
}
