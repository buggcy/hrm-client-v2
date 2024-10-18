'use client';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { DateRange } from 'react-day-picker';

import { attendanceListColumns } from '@/components/data-table/columns/attendance-list-columns';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { useAttendanceListQuery } from '@/hooks/attendanceList/useAttendanceList.hook';
import { AttendanceListType } from '@/libs/validations/attendance-list';
import { searchAttedanceList } from '@/services/hr/attendance-list.service';
import { AttendanceListStoreType } from '@/stores/hr/attendance-list';

interface AttendanceHistoryTableProps {
  dates?: DateRange;
}

const AttendanceListTable: FunctionComponent<AttendanceHistoryTableProps> = ({
  dates,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { attendanceListStore } = useStores() as {
    attendanceListStore: AttendanceListStoreType;
  };
  const { setRefetchAttendanceList, refetchAttendanceList } =
    attendanceListStore;

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;
  const initialSearchTerm = searchParams.get('search') || '';
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(initialSearchTerm);

  const {
    data: attendanceList,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useAttendanceListQuery({
    page,
    limit,
    from: dates?.from?.toISOString(),
    to: dates?.to?.toISOString(),
    Status: statusFilter,
  });

  const {
    mutate,
    isPending,
    data: searchAttendanceListData,
  } = useMutation({
    mutationFn: ({
      query,
      page,
      limit,
      Status,
    }: {
      query: string;
      page: number;
      limit: number;
      Status: string[];
    }) =>
      searchAttedanceList({
        query,
        page,
        limit,
        from: dates?.from,
        to: dates?.to,
        Status,
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
      mutate({ query: debouncedSearchTerm, page, limit, Status: statusFilter });
    } else {
      void (async () => {
        await refetch();
      })();
    }
  }, [debouncedSearchTerm, page, limit, refetch, mutate, statusFilter]);

  useEffect(() => {
    if (refetchAttendanceList) {
      void (async () => {
        await refetch();
      })();

      setRefetchAttendanceList(false);
    }
  }, [refetchAttendanceList, setRefetchAttendanceList, refetch]);

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

  const tableData: AttendanceListType[] = debouncedSearchTerm
    ? ((searchAttendanceListData?.data || []) as AttendanceListType[])
    : ((attendanceList?.data || []) as AttendanceListType[]);

  const tablePageCount: number | undefined = debouncedSearchTerm
    ? searchAttendanceListData?.pagination.totalPages
    : attendanceList?.pagination.totalPages;

  return (
    <>
      {isLoading || isFetching ? (
        <DataTableLoading columnCount={7} rowCount={limit} />
      ) : (
        <DataTable
          searchLoading={isPending}
          data={tableData || []}
          columns={attendanceListColumns}
          pagination={{
            pageCount: tablePageCount || 1,
            page: page,
            limit: limit,
            onPaginationChange: handlePaginationChange,
          }}
          onSearch={handleSearchChange}
          searchTerm={searchTerm}
          toolbarType="attendanceList"
          setFilterValue={setStatusFilter}
          filterValue={statusFilter}
        />
      )}
    </>
  );
};

export default AttendanceListTable;
