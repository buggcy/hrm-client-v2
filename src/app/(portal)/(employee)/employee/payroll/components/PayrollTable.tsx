'use client';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ZodError } from 'zod';

import { employeePayrollColumns } from '@/components/data-table/columns/employeePayroll.columns';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import {
  usePayrollChartQuery,
  usePayrollQuery,
} from '@/hooks/payroll/usePayroll.hook';
import { EmployeePayrollListType } from '@/libs/validations/employee';
import { searchPayoutList } from '@/services/employee/employeePayroll.service';
import { AuthStoreType } from '@/stores/auth';
import { EmployeePayrollStoreType } from '@/stores/employee/employeePayroll';

import PayrollCards from './PayrollCards';

import { MessageErrorResponse } from '@/types';

const PayrollTable: FunctionComponent<{ month: string; year: string }> = ({
  month,
  year,
}) => {
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;

  const { employeePayrollStore } = useStores() as {
    employeePayrollStore: EmployeePayrollStoreType;
  };
  const { setRefetchEmployeePayrollList, refetchEmployeePayrollList } =
    employeePayrollStore;
  const initialSearchTerm = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(initialSearchTerm);
  const [status, setStatus] = useState<string[]>([]);
  const {
    data: payrollList,
    isLoading,
    isFetching,
    error,
    refetch,
  } = usePayrollQuery(
    {
      page,
      limit,
      userId: user?.id ? user.id : '',
      status,
      month,
      year,
    },
    {
      enabled: !!user?.id && !!month && !!year,
    },
  );
  const { data: payrollChart, refetch: refetchPayroll } = usePayrollChartQuery(
    user?.id ? user.id : '',
    {
      enabled: !!user?.id,
    },
  );

  const {
    mutate,
    isPending,
    data: searchPayrollEmployeeData,
  } = useMutation({
    mutationFn: searchPayoutList,
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
        status,
        userId: user?.Tahometer_ID ? user.Tahometer_ID : '',
        month,
        year,
      });
    } else {
      void (async () => {
        await refetch();
      })();
    }
  }, [
    debouncedSearchTerm,
    page,
    limit,
    refetch,
    mutate,
    status,
    user?.Tahometer_ID,
    month,
    year,
  ]);

  useEffect(() => {
    void (async () => {
      await refetch();
    })();
  }, [page, limit, refetch, status]);

  useEffect(() => {
    if (refetchEmployeePayrollList) {
      void (async () => {
        await refetch();
        await refetchPayroll();
      })();

      setRefetchEmployeePayrollList(false);
    }
  }, [
    refetchEmployeePayrollList,
    page,
    limit,
    setRefetchEmployeePayrollList,
    refetch,
    status,
    refetchPayroll,
  ]);

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

  const tableData: EmployeePayrollListType[] = debouncedSearchTerm
    ? searchPayrollEmployeeData?.data || []
    : payrollList?.data || [];

  const tablePageCount: number | undefined = debouncedSearchTerm
    ? searchPayrollEmployeeData?.pagination?.totalPages || 0
    : payrollList?.pagination?.totalPages || 0;

  return (
    <>
      <PayrollCards
        month={month}
        year={year}
        payrollChart={payrollChart?.monthlyPayroll || []}
      />

      {isLoading || isFetching ? (
        <DataTableLoading columnCount={9} rowCount={limit} />
      ) : (
        <DataTable<EmployeePayrollListType, undefined>
          searchLoading={isPending}
          data={tableData || []}
          columns={employeePayrollColumns}
          pagination={{
            pageCount: tablePageCount || 1,
            page: page,
            limit: limit,
            onPaginationChange: handlePaginationChange,
          }}
          onSearch={handleSearchChange}
          searchTerm={searchTerm}
          toolbarType="hrPayrollList"
          setFilterValue={setStatus}
          filterValue={status}
        />
      )}
    </>
  );
};

export default PayrollTable;
