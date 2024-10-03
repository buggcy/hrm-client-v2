import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { useLeaveHistoryListQuery } from '@/hooks/leaveHistory/useLeaveHistoryList.hook';
import { searchLeaveHistoryList } from '@/services/employee/leave-history.service';
import { AuthStoreType } from '@/stores/auth';
import { LeaveHistoryStoreType } from '@/stores/employee/leave-history';

import { ApplyLeaveDialog } from './components/ApplyLeaveDialog';
import LeaveCards from './components/LeaveCards';
import LeaveHistoryTable from './components/LeaveHistoryTable.component';

interface LeaveHistoryPageProps {
  date: Date;
}

const LeaveHistoryPage: FunctionComponent<LeaveHistoryPageProps> = ({
  date,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;
  const searchParams = useSearchParams();
  const router = useRouter();
  const { leaveHistoryStore } = useStores() as {
    leaveHistoryStore: LeaveHistoryStoreType;
  };
  const { setRefetchLeaveHistoryList, refetchLeaveHistoryList } =
    leaveHistoryStore;

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;
  const initialSearchTerm = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(initialSearchTerm);

  const {
    data: leaveHistoryList,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useLeaveHistoryListQuery({
    page,
    limit,
    id: user?.id,
    month,
    year,
  });

  const {
    mutate,
    isPending,
    data: searchLeaveHistoryData,
  } = useMutation({
    mutationFn: ({
      query,
      page,
      limit,
    }: {
      query: string;
      page: number;
      limit: number;
    }) =>
      searchLeaveHistoryList({
        query,
        page,
        limit,
        id: user?.id ? user.id : '',
        month,
        year,
      }),
    onError: err => {
      toast({
        title: 'Error',
        description: err?.message || 'Error on fetching search data!',
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 800);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      mutate({ query: debouncedSearchTerm, page, limit });
    } else {
      void (async () => {
        await refetch();
      })();
    }
  }, [debouncedSearchTerm, page, limit, refetch, mutate]);

  useEffect(() => {
    if (refetchLeaveHistoryList) {
      void (async () => {
        await refetch();
      })();

      setRefetchLeaveHistoryList(false);
    }
  }, [
    refetchLeaveHistoryList,
    page,
    limit,
    setRefetchLeaveHistoryList,
    refetch,
  ]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handlePaginationChange = (newPage: number, newLimit: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    params.set('limit', newLimit.toString());
    router.push(`?${params.toString()}`);
  };
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-0">
          <CardTitle>Good Afternoon, Sourav!</CardTitle>
          <Button variant="default" onClick={handleDialogOpen}>
            Apply Leave Form
          </Button>
        </CardHeader>
        <CardContent>
          <CardDescription>You have 2 leave requests pending.</CardDescription>
        </CardContent>
      </Card>
      <LeaveCards date={date} />
      <LeaveHistoryTable
        leaveHistoryList={leaveHistoryList}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        isPending={isPending}
        searchLeaveHistoryData={searchLeaveHistoryData}
        handleSearchChange={handleSearchChange}
        handlePaginationChange={handlePaginationChange}
        page={page}
        limit={limit}
        searchTerm={searchTerm}
        debouncedSearchTerm={debouncedSearchTerm}
      />
      <ApplyLeaveDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onCloseChange={handleDialogClose}
        refetch={() => refetch()}
        page={page}
        limit={limit}
      />
    </>
  );
};

export default LeaveHistoryPage;
