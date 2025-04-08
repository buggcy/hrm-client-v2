'use client';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { ZodError } from 'zod';

import { attendanceListColumns } from '@/components/data-table/columns/attendance-list-columns';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { useAttendanceListQuery } from '@/hooks/attendanceList/useAttendanceList.hook';
import { AttendanceListType } from '@/libs/validations/attendance-list';
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
    from: dates?.from ? format(new Date(dates?.from), 'yyyy-MM-dd') : '',
    to: dates?.to ? format(new Date(dates?.to), 'yyyy-MM-dd') : '',
    Status: statusFilter,
    fullname: debouncedSearchTerm,
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
        Failed to load Attendance. Please check the data.
      </div>
    );

  const tableData: AttendanceListType[] = attendanceList?.data ?? [];

  const tablePageCount: number | undefined =
    attendanceList?.pagination.totalPages;

  return (
    <>
      {isLoading || isFetching ? (
        <DataTableLoading columnCount={7} rowCount={limit} />
      ) : (
        <DataTable
          searchLoading={isLoading || isFetching}
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
