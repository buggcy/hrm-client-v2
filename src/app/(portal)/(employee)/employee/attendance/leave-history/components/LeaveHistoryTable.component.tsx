'use client';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';

import { leaveHistoryListColumns } from '@/components/data-table/columns/leave-history-list.columns';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { useLeaveHistoryListQuery } from '@/hooks/leaveHistory/useLeaveHistoryList.hook';
import { LeaveHistoryListType } from '@/libs/validations/leave-history';
import { searchLeaveHistoryList } from '@/services/employee/leave-history.service';
import { AuthStoreType } from '@/stores/auth';
import { LeaveHistoryStoreType } from '@/stores/employee/leave-history';

interface LeaveHistoryTableProps {
  date: Date;
}

const LeaveHistoryTable: FunctionComponent<LeaveHistoryTableProps> = ({
  date,
}) => {
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
        await refetch({ page, limit });
      })();
    }
  }, [debouncedSearchTerm, page, limit, refetch, mutate]);

  useEffect(() => {
    if (refetchLeaveHistoryList) {
      void (async () => {
        await refetch({ page, limit });
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

  if (error)
    return (
      <div className="py-4 text-center text-red-500">
        Error: {error.message}
      </div>
    );

  const tableData: LeaveHistoryListType = debouncedSearchTerm
    ? searchLeaveHistoryData?.data
    : leaveHistoryList?.data;

  const tablePageCount: number = debouncedSearchTerm
    ? searchLeaveHistoryData?.pagination.totalPages
    : leaveHistoryList?.pagination.totalPages;

  return (
    <>
      {isLoading || isFetching ? (
        <DataTableLoading columnCount={7} rowCount={limit} />
      ) : (
        <DataTable
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
        />
      )}
    </>
  );
};

export default LeaveHistoryTable;
