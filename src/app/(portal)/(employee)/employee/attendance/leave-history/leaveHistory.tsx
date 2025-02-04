'use client';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { leaveHistoryListColumns } from '@/components/data-table/columns/leave-history-list.columns';
import { LeaveListDataTable } from '@/components/data-table/data-table-hr-leave-list';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import { DateRangePicker, useTimeRange } from '@/components/DateRangePicker';
import Header from '@/components/Header/Header';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { useLeaveListPostQuery } from '@/hooks/hr/useLeaveList.hook';
import { LeaveListArrayType } from '@/libs/validations/hr-leave-list';
import { searchLeaveList } from '@/services/hr/leave-list.service';
import { AuthStoreType } from '@/stores/auth';
import { LeaveHistoryStoreType } from '@/stores/employee/leave-history';
import { formatedDate } from '@/utils';

import { ApplyLeaveDialog } from './components/ApplyLeaveDialog';
import LeaveCards from './components/LeaveCards';

import { MessageErrorResponse } from '@/types';

interface LeaveHistoryPageProps {}

const LeaveHistoryPage: FunctionComponent<LeaveHistoryPageProps> = () => {
  const { timeRange, selectedDate, setTimeRange, handleSetDate } =
    useTimeRange();
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };
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
  const [status, setStatus] = useState<string[]>([]);
  const {
    data: leavePostList,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useLeaveListPostQuery(
    {
      page,
      limit,
      from: formatedDate(selectedDate?.from),
      to: formatedDate(selectedDate?.to),
      status,
      userId: user?.id,
    },
    {
      enabled: !!user?.id,
    },
  );

  const {
    mutate,
    isPending,
    data: searchLeaveListData,
  } = useMutation({
    mutationFn: searchLeaveList,
    onError: (err: unknown) => {
      const axiosError = err as AxiosError<MessageErrorResponse>;
      toast({
        title: 'Error',
        description:
          axiosError?.response?.data?.message ||
          'Error on fetching search data!',
        variant: 'error',
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
      mutate({
        query: debouncedSearchTerm,
        page,
        limit,
        from: formatedDate(selectedDate?.from),
        to: formatedDate(selectedDate?.to),
        user: user?.id || '',
      });
    } else {
      void (async () => {
        await refetch();
      })();
    }
  }, [
    debouncedSearchTerm,
    refetch,
    mutate,
    page,
    limit,
    status,
    selectedDate?.from,
    selectedDate?.to,
    user?.id,
  ]);

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
  useEffect(() => {}, [leavePostList, selectedDate]);
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handlePaginationChange = (newPage: number, newLimit: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    params.set('limit', newLimit.toString());
    router.push(`?${params.toString()}`);
  };
  if (error)
    return (
      <div className="py-4 text-center text-red-500">
        Error: {error.message}
      </div>
    );

  const tableData: LeaveListArrayType = debouncedSearchTerm
    ? searchLeaveListData?.data || []
    : leavePostList?.data || [];

  const tablePageCount: number | undefined = debouncedSearchTerm
    ? searchLeaveListData?.pagination.totalPages
    : leavePostList?.pagination.totalPages;
  return (
    <div className="flex flex-col gap-12">
      <Header subheading="Manage your leave requests and track their status with ease.">
        <DateRangePicker
          timeRange={timeRange}
          selectedDate={selectedDate}
          setTimeRange={setTimeRange}
          setDate={handleSetDate}
        />
        <Button variant="default" onClick={handleDialogOpen}>
          Apply Leave Form
        </Button>
      </Header>

      <LeaveCards date={selectedDate} />

      {isLoading || isFetching ? (
        <DataTableLoading columnCount={7} rowCount={limit} />
      ) : (
        <LeaveListDataTable
          searchLoading={isPending}
          data={tableData || []}
          columns={leaveHistoryListColumns}
          pagination={{
            pageCount: tablePageCount || 1,
            page: page,
            limit: limit,
            onPaginationChange: handlePaginationChange,
          }}
          onSearch={handleSearchChange}
          searchTerm={searchTerm}
          toolbarType={'leavePostList'}
          setFilterValue={setStatus}
          filterValue={status}
        />
      )}
      <ApplyLeaveDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onCloseChange={handleDialogClose}
      />
    </div>
  );
};

export default LeaveHistoryPage;
