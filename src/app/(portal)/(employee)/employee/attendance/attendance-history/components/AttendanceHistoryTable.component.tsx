'use client';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { DateRange } from 'react-day-picker';

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
  dates?: DateRange;
}

const AttendanceHistoryTable: FunctionComponent<
  AttendanceHistoryTableProps
> = ({ dates }) => {
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
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

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
    from: dates?.from?.toISOString(),
    to: dates?.to?.toISOString(),
    status: statusFilter,
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
      status,
    }: {
      query: string;
      page: number;
      limit: number;
      status: string[];
    }) =>
      searchAttedanceHistoryList({
        query,
        page,
        limit,
        id: user?.Tahometer_ID ? user.Tahometer_ID : '',
        from: dates?.from,
        to: dates?.to,
        status,
      }),
    onError: err => {
      toast({
        title: 'Error',
        description: err?.message || 'Error on fetching search data!',
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
      mutate({ query: debouncedSearchTerm, page, limit, status: statusFilter });
    } else {
      void (async () => {
        await refetch();
      })();
    }
  }, [debouncedSearchTerm, page, limit, refetch, mutate, statusFilter]);

  useEffect(() => {
    if (refetchAttendanceHistoryList) {
      void (async () => {
        await refetch();
      })();

      setRefetchAttendanceHistoryList(false);
    }
  }, [refetchAttendanceHistoryList, setRefetchAttendanceHistoryList, refetch]);

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

  const tableData: AttendanceHistoryListType[] = debouncedSearchTerm
    ? ((searchAttendanceHistoryData?.data || []) as AttendanceHistoryListType[])
    : ((attendanceHistoryList?.data || []) as AttendanceHistoryListType[]);

  const tablePageCount: number | undefined = debouncedSearchTerm
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
          toolbarType="attendanceHistory"
          setFilterValue={setStatusFilter}
          filterValue={statusFilter}
        />
      )}
    </>
  );
};

export default AttendanceHistoryTable;
