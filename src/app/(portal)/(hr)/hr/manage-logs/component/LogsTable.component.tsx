'use client';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { LogsListColumns } from '@/components/data-table/columns/logs-list.column';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider'; //..

import { useLogsListQuery } from '@/hooks/logs/useLogsList.hook'; //.true
import { LogsListArrayType } from '@/libs/validations/logs'; //.True
import { searchLogsList } from '@/services/hr/logs.services'; //.True
import { LogsListStoreType } from '@/stores/hr/hr-logs.Store'; //..still changes left

import { MessageErrorResponse } from '@/types';

const LogsTable: FunctionComponent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { logsListStore } = useStores() as unknown as {
    logsListStore: LogsListStoreType;
  };
  const { setRefetchLogsList, refetchLogsList } = logsListStore;

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;
  const initialSearchTerm = searchParams.get('search') || '';
  const [genderFilter, setGenderFilter] = useState<string[]>([]);

  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(initialSearchTerm);

  const {
    data: logsList,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useLogsListQuery({ page, limit });

  const {
    mutate,
    isPending,
    data: searchLogsData,
  } = useMutation({
    mutationFn: searchLogsList,
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
      mutate({ query: debouncedSearchTerm, page, limit });
    } else {
      void (async () => {
        await refetch();
      })();
    }
  }, [debouncedSearchTerm, refetch, mutate, page, limit, genderFilter]);

  useEffect(() => {
    if (refetchLogsList) {
      void (async () => {
        await refetch();
      })();

      setRefetchLogsList(false);
    }
  }, [refetchLogsList, setRefetchLogsList, refetch]);

  useEffect(() => {
    void (async () => {
      await refetch();
    })();
  }, [genderFilter, refetch]);

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

  const tableData: LogsListArrayType = debouncedSearchTerm
    ? searchLogsData?.data || []
    : logsList?.data || [];

  const tablePageCount: number = debouncedSearchTerm
    ? searchLogsData?.pagination?.totalPages || 0
    : logsList?.pagination?.totalPages || 0;

  return (
    <>
      {isLoading || isFetching ? (
        <DataTableLoading columnCount={7} rowCount={limit} />
      ) : (
        <DataTable
          searchLoading={isPending}
          data={tableData || []}
          columns={LogsListColumns}
          pagination={{
            pageCount: tablePageCount || 1,
            page: page,
            limit: limit,
            onPaginationChange: handlePaginationChange,
          }}
          onSearch={handleSearchChange}
          searchTerm={searchTerm}
          toolbarType={'employeeList'}
          setFilterValue={setGenderFilter}
          filterValue={genderFilter}
        />
      )}
    </>
  );
};

export default LogsTable;
