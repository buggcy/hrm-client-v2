'use client';
import React, { FunctionComponent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { employeeListColumns } from '@/components/data-table/columns/employee-list.columns';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableLoading } from '@/components/data-table/data-table-skeleton';

import { useEmployeeListQuery } from '@/hooks/employee/useEmployeeList.hook';

const EmployeeTable: FunctionComponent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;

  const {
    data: employeeList,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useEmployeeListQuery({ page, limit });

  useEffect(() => {
    void (async () => {
      await refetch();
    })();
  }, [page, limit, refetch]);

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

  return (
    <>
      {isLoading || isFetching ? (
        <DataTableLoading columnCount={7} rowCount={limit} />
      ) : (
        <DataTable
          data={employeeList?.data || []}
          columns={employeeListColumns}
          pagination={{
            pageCount: employeeList?.pagination.totalPages || 1,
            page: page,
            limit: limit,
            onPaginationChange: handlePaginationChange,
          }}
          searchTerm={''}
          onSearch={function (): void {
            throw new Error('Function not implemented.');
          }}
          searchLoading={false}
        />
      )}
    </>
  );
};

export default EmployeeTable;
