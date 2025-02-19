'use client';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ZodError } from 'zod';

import { unapprovedEmployeeColumns } from '@/components/data-table/columns/unapproved-employee.column';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { useUnapprovedEmployeeQuery } from '@/hooks/employee/useUnApprovedEmployee.hook';
import { EmployeeListArrayType } from '@/libs/validations/employee';
import { unapprovedSearchEmployeeList } from '@/services/hr/employee.service';
import { EmployeeStoreType } from '@/stores/hr/employee';

import { MessageErrorResponse } from '@/types';

const UnApprovedEmployeeTable: FunctionComponent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { employeeStore } = useStores() as { employeeStore: EmployeeStoreType };
  const { setRefetchEmployeeList, refetchEmployeeList } = employeeStore;

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;
  const initialSearchTerm = searchParams.get('search') || '';
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(initialSearchTerm);

  const {
    data: employeeList,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useUnapprovedEmployeeQuery({ page, limit, isApproved: statusFilter });

  const {
    mutate,
    isPending,
    data: searchEmployeeData,
  } = useMutation({
    mutationFn: unapprovedSearchEmployeeList,
    onError: (err: unknown) => {
      const axiosError = err as AxiosError<MessageErrorResponse>;
      toast({
        title: 'Error',
        description:
          axiosError?.response?.data?.error ||
          axiosError?.response?.data?.message ||
          'Error on fetching search data!',
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
        isApproved: statusFilter,
      });
    } else {
      void (async () => {
        await refetch();
      })();
    }
  }, [debouncedSearchTerm, refetch, mutate, page, limit, statusFilter]);

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
  }, [statusFilter, refetch]);

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
        Failed to load Unapproved Employees. Please check the data.
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
      {isLoading || isFetching ? (
        <DataTableLoading columnCount={7} rowCount={limit} />
      ) : (
        <DataTable
          searchLoading={isPending}
          data={tableData || []}
          columns={unapprovedEmployeeColumns}
          pagination={{
            pageCount: tablePageCount || 1,
            page: page,
            limit: limit,
            onPaginationChange: handlePaginationChange,
          }}
          onSearch={handleSearchChange}
          searchTerm={searchTerm}
          toolbarType={'unapprovedEmployeeList'}
          setFilterValue={setStatusFilter}
          filterValue={statusFilter}
        />
      )}
    </>
  );
};

export default UnApprovedEmployeeTable;
