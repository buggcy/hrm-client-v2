'use client';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { DateRange } from 'react-day-picker';
import { ZodError } from 'zod';

import { attendanceHistoryListColumns } from '@/components/data-table/columns/attendance-history-list.columns';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { useAttendanceHistoryListQuery } from '@/hooks/attendanceHistory/useAttendanceHistoryList.hook';
import { AttendanceHistoryListType } from '@/libs/validations/attendance-history';
import { AuthStoreType } from '@/stores/auth';
import { AttendanceHistoryStoreType } from '@/stores/employee/attendance-history';
import { formatedDate } from '@/utils';

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
    from: formatedDate(dates?.from),
    to: formatedDate(dates?.to),
    status: statusFilter,
    query: debouncedSearchTerm,
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
    if (error) {
      if (error instanceof ZodError) {
        error.issues.forEach(issue => {
          const path = issue.path;
          const message = issue.message;

          toast({
            title: `Validation Error at ${path.join(', ')}`,
            description: message,
            variant: 'error',
          });
        });
      } else {
        toast({
          title: 'Error',
          description: error.message || 'An error occurred',
          variant: 'error',
        });
      }
    }
  }, [error]);

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
        Failed to Attendance. Please check the data.
      </div>
    );

  const tableData: AttendanceHistoryListType[] = (attendanceHistoryList?.data ||
    []) as AttendanceHistoryListType[];

  const tablePageCount: number | undefined =
    attendanceHistoryList?.pagination.totalPages;

  return (
    <>
      {isLoading || isFetching ? (
        <DataTableLoading columnCount={7} rowCount={limit} />
      ) : (
        <DataTable
          searchLoading={isLoading || isFetching}
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
