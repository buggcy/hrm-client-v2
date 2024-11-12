'use client';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { departmentColumns } from '@/components/data-table/columns/department.columns';
import { DepartmentDataTable } from '@/components/data-table/data-table-department';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import Header from '@/components/Header/Header';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import {
  useDepartmentQuery,
  useDepartmentRecordQuery,
} from '@/hooks/hr/useProjectDepartment.hook';
import { DepartmentListArrayType } from '@/libs/validations/project-department';
import { searchDepartments } from '@/services/hr/project-department.service';
import { ProjectStoreType } from '@/stores/hr/project-department';

import { DepartmentOverviewChat } from './Chart/DepartmentOverviewChart';
import { TopDepartmentChart } from './Chart/TopDepartmentChart';

import { MessageErrorResponse } from '@/types';

interface TableProps {}
const DepartmentTable: FunctionComponent<TableProps> = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { projectStore } = useStores() as { projectStore: ProjectStoreType };
  const { setRefetchProjectList, refetchProjectList } = projectStore;
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;
  const initialSearchTerm = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(initialSearchTerm);

  const {
    data: getDepartments,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useDepartmentQuery({
    page,
    limit,
  });
  const { data: departmentRecord, refetch: refetchRecord } =
    useDepartmentRecordQuery();
  const {
    mutate,
    isPending,
    data: searchData,
  } = useMutation({
    mutationFn: searchDepartments,
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
        await refetchRecord();
      })();
    }
  }, [debouncedSearchTerm, refetch, mutate, page, limit, refetchRecord]);

  useEffect(() => {}, [getDepartments]);
  useEffect(() => {}, [departmentRecord]);
  useEffect(() => {
    if (refetchProjectList) {
      void (async () => {
        await refetch();
        await refetchRecord();
      })();

      setRefetchProjectList(false);
    }
  }, [refetchProjectList, setRefetchProjectList, refetch, refetchRecord]);

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

  const tableData: DepartmentListArrayType = debouncedSearchTerm
    ? searchData?.data || []
    : getDepartments?.data || [];

  const tablePageCount: number = debouncedSearchTerm
    ? searchData?.pagination?.totalPages || 0
    : getDepartments?.pagination?.totalPages || 0;

  return (
    <>
      <Header subheading="Effortlessly Add, Organize, and Manage Departments to Drive Team Success!">
        <Button size={'sm'}>Add Department</Button>
      </Header>
      <div className="mt-6 grid w-full grid-cols-1 gap-x-0 gap-y-4 lg:grid-cols-3 lg:gap-x-4 lg:gap-y-0">
        <TopDepartmentChart chartData={departmentRecord?.topChart} />
        <DepartmentOverviewChat chartData={departmentRecord?.Overiew} />
      </div>
      <div className="mt-6">
        {isLoading || isFetching ? (
          <DataTableLoading columnCount={5} rowCount={limit} />
        ) : (
          <DepartmentDataTable
            searchLoading={isPending}
            data={tableData || []}
            columns={departmentColumns}
            pagination={{
              pageCount: tablePageCount || 1,
              page: page,
              limit: limit,
              onPaginationChange: handlePaginationChange,
            }}
            onSearch={handleSearchChange}
            searchTerm={searchTerm}
            toolbarType={'getDepartments'}
          />
        )}
      </div>
    </>
  );
};

export default DepartmentTable;
