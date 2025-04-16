'use client';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ZodError } from 'zod';

import { hrOvertimeColumns } from '@/components/data-table/columns/hr-overtime.columns';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { useOvertimeQuery } from '@/hooks/overtime/useOvertime.hook';
import { OvertimeListArrayType } from '@/libs/validations/overtime';
import { searchOvertime } from '@/services/employee/overtime.service';
import { OvertimeStoreType } from '@/stores/employee/overtime';
import { formatedDate } from '@/utils';

import { MessageErrorResponse } from '@/types';

interface TableProps {
  selectedDate?: {
    from?: Date;
    to?: Date;
  };
}
const OvertimeHRTable: FunctionComponent<TableProps> = ({ selectedDate }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { overtimeStore } = useStores() as {
    overtimeStore: OvertimeStoreType;
  };
  const { setRefetchOvertimeList, refetchOvertimeList } = overtimeStore;

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;
  const initialSearchTerm = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(initialSearchTerm);
  const [status, setStatus] = useState<string[]>([]);

  const {
    data: getOvertime,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useOvertimeQuery({
    page,
    limit,
    from: formatedDate(selectedDate?.from),
    to: formatedDate(selectedDate?.to),
    status,
    userId: '',
  });

  const {
    mutate,
    isPending,
    data: searchData,
  } = useMutation({
    mutationFn: searchOvertime,
    onError: (err: unknown) => {
      const axiosError = err as AxiosError<MessageErrorResponse>;
      toast({
        title: 'Error',
        description:
          axiosError?.response?.data?.message ||
          'An unexpected error occurred. Please try again later or contact support if the issue persists.',
        variant: 'error',
      });
    },
  });

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
        userId: '',
        from: formatedDate(selectedDate?.from),
        to: formatedDate(selectedDate?.to),
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
  ]);

  useEffect(() => {}, [getOvertime, selectedDate]);

  useEffect(() => {
    if (refetchOvertimeList) {
      void (async () => {
        await refetch();
      })();

      setRefetchOvertimeList(false);
    }
  }, [refetchOvertimeList, setRefetchOvertimeList, refetch, status]);

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
        Failed to load Overtime requests. Please check the data.
      </div>
    );

  const tableData: OvertimeListArrayType = debouncedSearchTerm
    ? searchData?.data || []
    : getOvertime?.data || [];

  const tablePageCount: number = debouncedSearchTerm
    ? searchData?.pagination?.totalPages || 0
    : getOvertime?.pagination?.totalPages || 0;

  return (
    <>
      {isLoading || isFetching ? (
        <DataTableLoading columnCount={6} rowCount={limit} />
      ) : (
        <DataTable
          searchLoading={isPending}
          data={tableData || []}
          columns={hrOvertimeColumns}
          pagination={{
            pageCount: tablePageCount || 1,
            page: page,
            limit: limit,
            onPaginationChange: handlePaginationChange,
          }}
          onSearch={handleSearchChange}
          searchTerm={searchTerm}
          toolbarType={'getOvertime'}
          setFilterValue={setStatus}
          filterValue={status}
        />
      )}
    </>
  );
};

export default OvertimeHRTable;
