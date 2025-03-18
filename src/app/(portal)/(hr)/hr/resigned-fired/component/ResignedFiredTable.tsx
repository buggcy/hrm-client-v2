'use client';
import React, { FunctionComponent, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ZodError } from 'zod';

import { unapprovedEmployeeColumns } from '@/components/data-table/columns/unapproved-employee.column';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import Header from '@/components/Header/Header';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { useResignedFiredEmployeeQuery } from '@/hooks/employee/useUnApprovedEmployee.hook';
import { EmployeeListArrayType } from '@/libs/validations/employee';
import { resignedFiredSearchEmployeeList } from '@/services/hr/employee.service';
import { EmployeeStoreType } from '@/stores/hr/employee';

import { MessageErrorResponse } from '@/types';

const ResignedFiredEmployeeTable: FunctionComponent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const path = usePathname();

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
    data: resignedFiredEmployeeList,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useResignedFiredEmployeeQuery({ page, limit, isApproved: statusFilter });

  const {
    mutate,
    isPending,
    data: searchEmployeeData,
  } = useMutation({
    mutationFn: resignedFiredSearchEmployeeList,
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
        Failed to load Resigned & Fired Employee. An unexpected error occurred.
      </div>
    );

  const tableData: EmployeeListArrayType = debouncedSearchTerm
    ? searchEmployeeData?.data || []
    : resignedFiredEmployeeList?.data || [];

  const tablePageCount: number = debouncedSearchTerm
    ? searchEmployeeData?.pagination?.totalPages || 0
    : resignedFiredEmployeeList?.pagination?.totalPages || 0;

  return (
    <>
      <Header subheading="Creating a culture where people thrive and businesses grow.">
        <Button asChild>
          <Link
            href={`${path.startsWith('/manager') ? '/manager' : '/hr'}/resigned-employees`}
            className="flex items-center"
          >
            View Resignations
            <span className="ml-2 flex size-6 items-center justify-center rounded-full bg-muted text-gray-600 dark:text-gray-300">
              {resignedFiredEmployeeList?.totalPendingCount || 0}
            </span>
          </Link>
        </Button>
      </Header>
      <div className="mt-5">
        {' '}
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
            toolbarType={'resignedFiredEmployeeList'}
            setFilterValue={setStatusFilter}
            filterValue={statusFilter}
          />
        )}
      </div>
    </>
  );
};

export default ResignedFiredEmployeeTable;
