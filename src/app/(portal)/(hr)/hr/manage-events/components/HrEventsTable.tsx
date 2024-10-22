'use client';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { hrEventsColumns } from '@/components/data-table/columns/hrEventsColumns';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { useHrEventsQuery } from '@/hooks/hrEvents/useHrEventsQuery';
import { HrEventsListType } from '@/libs/validations/employee';
import { searchHrEventsList } from '@/services/hr/hrEvents.service';
import { HrEventsStoreType } from '@/stores/hr/hrEvents';

import { MessageErrorResponse } from '@/types';

const HrEventsTable: FunctionComponent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;

  const { hrEventsStore } = useStores() as {
    hrEventsStore: HrEventsStoreType;
  };
  const { setRefetchHrEventsList, refetchHrEventsList } = hrEventsStore;
  const initialSearchTerm = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(initialSearchTerm);
  const [hrStatusFilter, setHrStatusFilter] = useState<string[]>([]);

  const {
    data: hrEventsList,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useHrEventsQuery({
    page,
    limit,
    hrStatus: hrStatusFilter,
  });

  const {
    mutate,
    isPending,
    data: hrEventsListData,
  } = useMutation({
    mutationFn: searchHrEventsList,
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
        hrStatus: hrStatusFilter,
      });
    } else {
      void (async () => {
        await refetch();
      })();
    }
  }, [debouncedSearchTerm, page, limit, refetch, mutate, hrStatusFilter]);

  useEffect(() => {
    void (async () => {
      await refetch();
    })();
  }, [page, limit, refetch, hrStatusFilter]);

  useEffect(() => {
    if (refetchHrEventsList) {
      void (async () => {
        await refetch();
      })();

      setRefetchHrEventsList(false);
    }
  }, [refetchHrEventsList, page, limit, setRefetchHrEventsList, refetch]);

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

  const tableData: HrEventsListType[] = debouncedSearchTerm
    ? // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      ((hrEventsListData?.data || []) as HrEventsListType[])
    : ((hrEventsList?.data || []) as HrEventsListType[]);

  const tablePageCount: number | undefined = debouncedSearchTerm
    ? hrEventsListData?.pagination?.totalPages || 0
    : hrEventsList?.pagination?.totalPages || 0;

  return (
    <>
      {isLoading || isFetching ? (
        <DataTableLoading columnCount={7} rowCount={limit} />
      ) : (
        <DataTable<HrEventsListType, undefined>
          searchLoading={isPending}
          data={tableData || []}
          columns={hrEventsColumns}
          pagination={{
            pageCount: tablePageCount || 1,
            page: page,
            limit: limit,
            onPaginationChange: handlePaginationChange,
          }}
          onSearch={handleSearchChange}
          searchTerm={searchTerm}
          toolbarType={'hrEventsList'}
          setFilterValue={setHrStatusFilter}
          filterValue={hrStatusFilter}
        />
      )}
    </>
  );
};

export default HrEventsTable;
