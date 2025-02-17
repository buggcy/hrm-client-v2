'use client';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { employeeDobListColumns } from '@/components/data-table/columns/employeeDob-list.columns';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { useEmployeeDobTableQuery } from '@/hooks/EmployeeDobTable/useEmpDob.hook';
import { EmployeeDobTableListArrayType } from '@/libs/validations/employee';
import { searchEmployeeDobTableList } from '@/services/hr/employeeDob.service';
import { EmployeeDobStoreType } from '@/stores/hr/employeeDob';

import { MessageErrorResponse } from '@/types';

const EmpBirthdayTable: FunctionComponent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { employeeDobStore } = useStores() as {
    employeeDobStore: EmployeeDobStoreType;
  };
  const { setRefetchEmployeeList, refetchEmployeeList } = employeeDobStore;

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;
  const initialSearchTerm = searchParams.get('search') || '';
  const [genderFilter, setGenderFilter] = useState<string[]>([]);

  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(initialSearchTerm);

  const {
    data: employeeDobList,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useEmployeeDobTableQuery({
    page,
    limit,
    firstName: '',
    lastName: '',
    remainingDays: 0,
  });

  const {
    mutate,
    isPending,
    data: searchEmployeeDobData,
  } = useMutation({
    mutationFn: searchEmployeeDobTableList,
    onError: (err: unknown) => {
      const axiosError = err as AxiosError<MessageErrorResponse>;
      toast({
        title: 'Error',
        description:
          axiosError?.response?.data?.error ||
          axiosError?.response?.data?.message ||
          'An unexpected error occurred. Please try again later or contact support if the issue persists.',
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
  }, [debouncedSearchTerm, refetch, mutate, page, limit]);

  useEffect(() => {
    if (refetchEmployeeList) {
      void (async () => {
        await refetch();
      })();

      setRefetchEmployeeList(false);
    }
  }, [refetchEmployeeList, setRefetchEmployeeList, refetch]);

  useEffect(() => {
    void (async () => {
      await refetch();
    })();
  }, [refetch]);

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

  const tableData: EmployeeDobTableListArrayType = debouncedSearchTerm
    ? ((searchEmployeeDobData?.data || []) as EmployeeDobTableListArrayType)
    : ((employeeDobList?.data || []) as EmployeeDobTableListArrayType);

  const tablePageCount: number | undefined = debouncedSearchTerm
    ? searchEmployeeDobData?.pagination?.totalPages || 0
    : employeeDobList?.pagination?.totalPages || 0;

  return (
    <>
      {isLoading || isFetching ? (
        <DataTableLoading columnCount={3} rowCount={limit} />
      ) : (
        <DataTable
          searchLoading={isPending}
          data={tableData || []}
          columns={employeeDobListColumns}
          pagination={{
            pageCount: tablePageCount || 1,
            page: page,
            limit: limit,
            onPaginationChange: handlePaginationChange,
          }}
          onSearch={handleSearchChange}
          searchTerm={searchTerm}
          toolbarType={'hrEmpDobTableList'}
          setFilterValue={setGenderFilter}
          filterValue={genderFilter}
        />
      )}
    </>
  );
};

export default EmpBirthdayTable;
