'use client';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';

import { attendanceHistoryListColumns } from '@/components/data-table/columns/attendance-history-list.columns';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { useAttendanceHistoryListQuery } from '@/hooks/attendanceHistory/useAttendanceHistoryList.hook';
import { AttendanceHistoryListType } from '@/libs/validations/attendance-history';
import { searchAttedanceHistoryList } from '@/services/employee/attendance-history.service';
import { AuthStoreType } from '@/stores/auth';
import { AttendanceHistoryStoreType } from '@/stores/employee/attendance-history';

interface AttendanceHistoryTableProps {
  date: Date;
}

const AttendanceHistoryTable: FunctionComponent<
  AttendanceHistoryTableProps
> = ({ date }) => {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;
  const searchParams = useSearchParams();
  const router = useRouter();
  const { attendanceHistoryStore } = useStores() as {
    attendanceHistoryStore: AttendanceHistoryStoreType;
  };
  const { setRefetchAttendanceHistoryList, refetchAttendanceHistoryList } =
    attendanceHistoryStore;

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;
  const initialSearchTerm = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(initialSearchTerm);

  const {
    data: attendanceHistoryList,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useAttendanceHistoryListQuery({
    page,
    limit,
    id: user?.Tahometer_ID,
    month,
    year,
  });

  const {
    mutate,
    isPending,
    data: searchAttendanceHistoryData,
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
      searchAttedanceHistoryList({
        query,
        page,
        limit,
        id: user?.Tahometer_ID ? user.Tahometer_ID : '',
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
    if (refetchAttendanceHistoryList) {
      void (async () => {
        await refetch({ page, limit });
      })();

      setRefetchAttendanceHistoryList(false);
    }
  }, [
    refetchAttendanceHistoryList,
    page,
    limit,
    setRefetchAttendanceHistoryList,
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

  const tableData: AttendanceHistoryListType = debouncedSearchTerm
    ? searchAttendanceHistoryData?.data
    : attendanceHistoryList?.data;

  const tablePageCount: number = debouncedSearchTerm
    ? searchAttendanceHistoryData?.pagination.totalPages
    : attendanceHistoryList?.pagination.totalPages;

  return (
    <>
      {isLoading || isFetching ? (
        <DataTableLoading columnCount={7} rowCount={limit} />
      ) : (
        <DataTable
          searchLoading={isPending}
          data={tableData || []}
          columns={attendanceHistoryListColumns}
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

export default AttendanceHistoryTable;
