'use client';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { employeeListColumns } from '@/components/data-table/columns/employee-list.columns';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import Header from '@/components/Header/Header';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { useEmployeeApprovalStatsQuery } from '@/hooks/employee/useApprovalEmployee.hook';
import { useEmployeeListQuery } from '@/hooks/employee/useEmployeeList.hook';
import {
  defaultParams,
  useHrDashboardStatsQuery,
} from '@/hooks/hr/useDasdhboard.hook';
import { EmployeeListArrayType } from '@/libs/validations/employee';
import { searchEmployeeList } from '@/services/hr/employee.service';
import { EmployeeStoreType } from '@/stores/hr/employee';

import ChartsPage from './ChartsPage';

import { MessageErrorResponse } from '@/types';

const EmployeeTable: FunctionComponent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { employeeStore } = useStores() as { employeeStore: EmployeeStoreType };
  const { setRefetchEmployeeList, refetchEmployeeList } = employeeStore;
  const { data: hrDashboardStats, refetch: RefetchDashboard } =
    useHrDashboardStatsQuery(defaultParams);
  const { data: hrEmployeeApprovalStats, refetch: RefetchEmployee } =
    useEmployeeApprovalStatsQuery();
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;
  const initialSearchTerm = searchParams.get('search') || '';
  const [genderFilter, setGenderFilter] = useState<string[]>([]);

  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(initialSearchTerm);

  const {
    data: employeeList,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useEmployeeListQuery({ page, limit, gender: genderFilter });

  const {
    mutate,
    isPending,
    data: searchEmployeeData,
  } = useMutation({
    mutationFn: searchEmployeeList,
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
      mutate({ query: debouncedSearchTerm, page, limit, gender: genderFilter });
    } else {
      void (async () => {
        await refetch();
        await RefetchDashboard();
        await RefetchEmployee();
      })();
    }
  }, [
    debouncedSearchTerm,
    refetch,
    mutate,
    page,
    limit,
    genderFilter,
    RefetchDashboard,
    RefetchEmployee,
  ]);

  useEffect(() => {
    if (refetchEmployeeList) {
      void (async () => {
        await refetch();
        await RefetchDashboard();
        await RefetchEmployee();
      })();

      setRefetchEmployeeList(false);
    }
  }, [
    refetchEmployeeList,
    setRefetchEmployeeList,
    refetch,
    RefetchDashboard,
    RefetchEmployee,
  ]);

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

  const tableData: EmployeeListArrayType = debouncedSearchTerm
    ? searchEmployeeData?.data || []
    : employeeList?.data || [];

  const tablePageCount: number = debouncedSearchTerm
    ? searchEmployeeData?.pagination?.totalPages || 0
    : employeeList?.pagination?.totalPages || 0;

  return (
    <>
      <Header subheading="Transforming employee management into a journey of growth and success."></Header>
      <div className="mb-6">
        <ChartsPage
          hrDashboardStats={hrDashboardStats?.employeeCount}
          hrEmployeeApprovalStats={hrEmployeeApprovalStats?.employeeChart}
        />
      </div>
      {isLoading || isFetching ? (
        <DataTableLoading columnCount={7} rowCount={limit} />
      ) : (
        <DataTable
          searchLoading={isPending}
          data={tableData || []}
          columns={employeeListColumns}
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

export default EmployeeTable;
