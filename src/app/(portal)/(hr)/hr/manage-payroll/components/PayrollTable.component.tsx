'use client';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ZodError } from 'zod';

import { hrPayrollColumns } from '@/components/data-table/columns/hr-payroll.columns';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { useHRPayrollListQuery } from '@/hooks/payroll/useHRPayroll.hook';
import { HRPayrollListType } from '@/libs/validations/hr-payroll';
import { searchHRPayrollList } from '@/services/hr/payroll.service';
import { EmployeeStoreType } from '@/stores/hr/employee';

import { MessageErrorResponse } from '@/types';

interface PayrollTableProps {
  month?: string;
  year?: string;
}

const PayrollTable: FunctionComponent<PayrollTableProps> = ({
  month,
  year,
}) => {
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
    data: payrollList,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useHRPayrollListQuery({
    page,
    limit,
    month,
    year,
    payStatus: statusFilter,
  });

  const {
    mutate,
    isPending,
    data: searchHRPayroll,
  } = useMutation({
    mutationFn: searchHRPayrollList,
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
        month,
        year,
        payStatus: statusFilter,
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
    month,
    year,
    statusFilter,
  ]);

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
        Failed to load Payroll. Please check the data.
      </div>
    );

  const tableData: HRPayrollListType[] = debouncedSearchTerm
    ? searchHRPayroll?.data || []
    : payrollList?.data || [];

  const tablePageCount: number = debouncedSearchTerm
    ? searchHRPayroll?.pagination?.totalPages || 0
    : payrollList?.pagination?.totalPages || 0;

  return (
    <>
      {isLoading || isFetching ? (
        <DataTableLoading columnCount={7} rowCount={limit} />
      ) : (
        <DataTable
          searchLoading={isPending}
          data={tableData || []}
          columns={hrPayrollColumns}
          pagination={{
            pageCount: tablePageCount || 1,
            page: page,
            limit: limit,
            onPaginationChange: handlePaginationChange,
          }}
          onSearch={handleSearchChange}
          searchTerm={searchTerm}
          toolbarType={'hrPayrollList'}
          setFilterValue={setStatusFilter}
          filterValue={statusFilter}
        />
      )}
    </>
  );
};

export default PayrollTable;
