'use client';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { hrLogListColumns } from '@/components/data-table/columns/hr-log.columns';
import { LogListDataTable } from '@/components/data-table/data-table-hr-logs';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import { DateRangePicker, useTimeRange } from '@/components/DateRangePicker';
import Header from '@/components/Header/Header';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { useLogListQuery } from '@/hooks/hr/useLogList.hook';
import { LogListArrayType } from '@/libs/validations/hr-log';
import { searchLog } from '@/services/hr/log.service';
import { LogStoreType } from '@/stores/hr/logs';
import { formatedDate } from '@/utils';

import { MessageErrorResponse } from '@/types';

const LogTable: FunctionComponent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { logStore } = useStores() as { logStore: LogStoreType };
  const { setRefetchLogList, refetchLogList } = logStore;

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;
  const initialSearchTerm = searchParams.get('search') || '';
  const { timeRange, selectedDate, setTimeRange, handleSetDate } =
    useTimeRange();

  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(initialSearchTerm);
  const [status, setStatus] = useState<string[]>([]);

  const {
    data: logList,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useLogListQuery({
    page,
    limit,
    from: formatedDate(selectedDate?.from),
    to: formatedDate(selectedDate?.to),
    status,
  });

  const {
    mutate,
    isPending,
    data: searchData,
  } = useMutation({
    mutationFn: searchLog,
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

  useEffect(() => {}, [logList, selectedDate]);
  useEffect(() => {
    if (refetchLogList) {
      void (async () => {
        await refetch();
      })();

      setRefetchLogList(false);
    }
  }, [refetchLogList, setRefetchLogList, refetch, status]);

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

  const tableData: LogListArrayType = debouncedSearchTerm
    ? searchData?.data || []
    : logList?.data || [];

  const tablePageCount: number = debouncedSearchTerm
    ? searchData?.pagination?.totalPages || 0
    : logList?.pagination?.totalPages || 0;

  return (
    <>
      <Header subheading="Effortlessly Monitor and Manage Your System Logs!">
        <DateRangePicker
          timeRange={timeRange}
          selectedDate={selectedDate}
          setTimeRange={setTimeRange}
          setDate={handleSetDate}
        />
      </Header>
      <div className="mt-6">
        {isLoading || isFetching ? (
          <DataTableLoading columnCount={5} rowCount={limit} />
        ) : (
          <LogListDataTable
            searchLoading={isPending}
            data={tableData || []}
            columns={hrLogListColumns}
            pagination={{
              pageCount: tablePageCount || 1,
              page: page,
              limit: limit,
              onPaginationChange: handlePaginationChange,
            }}
            onSearch={handleSearchChange}
            searchTerm={searchTerm}
            toolbarType={'logList'}
            setFilterValue={setStatus}
            filterValue={status}
          />
        )}
      </div>
    </>
  );
};

export default LogTable;
